/**
 * @module uploadController
 * @description Обрабатывает загрузку файлов через multer и возвращает публичный URL.
 */

import { Request, Response } from 'express'
import { AuthRequest } from '../types'
import { getGridFSBucket } from '../config/gridfs'
import mongoose from 'mongoose'

/**
 * Принимает файл, загруженный через `multipart/form-data`, и возвращает его URL.
 * Файл должен быть передан в поле с именем `file`.
 *
 * @param {AuthRequest} req - Должен иметь `req.file`, добавленный multer
 * @param {Response} res - 201 с `{ url, filename }`
 */
export function uploadFile(req: AuthRequest, res: Response): void {
    if (!req.file) {
        res.status(400).json({ message: 'Файл не предоставлен' })
        return
    }

    
    // // Статическая загрузка (локально)
    // const url = `/uploads/${req.file.filename}`
    // res.status(201).json({ url, filename: req.file.filename })
    // return
    

    try {
        const gfsBucket = getGridFSBucket()
        const file = req.file
        
        const writeStream = gfsBucket.openUploadStream(file.originalname, {
            chunkSizeBytes: 1048576,
            metadata: { contentType: file.mimetype }
        })

        writeStream.end(file.buffer)

        writeStream.on('finish', () => {
            const url = `/api/upload/${writeStream.id}`
            res.status(201).json({ url, filename: file.originalname })
        })

        writeStream.on('error', (err) => {
            console.error('Ошибка записи файла в GridFS:', err)
            res.status(500).json({ message: 'Ошибка при сохранении файла' })
        })
    } catch (err) {
        console.error('Ошибка в uploadFile (GridFS):', err)
        res.status(500).json({ message: 'Внутренняя ошибка сервера при сохранении' })
    }
}

/**
 * Отдает файл по его GridFS ID.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getFile(req: Request, res: Response): Promise<void> {
    try {
        const idParam = req.params.id
        const fileId = new mongoose.Types.ObjectId(typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : String(idParam))
        const gfsBucket = getGridFSBucket()
        
        const files = await gfsBucket.find({ _id: fileId }).toArray()
        if (!files || files.length === 0) {
            res.status(404).json({ message: 'Файл не найден' })
            return
        }

        const file = files[0]
        if (file.metadata && file.metadata.contentType) {
            res.set('Content-Type', file.metadata.contentType)
        }
        res.set('Cache-Control', 'public, max-age=31557600')

        const readStream = gfsBucket.openDownloadStream(fileId)
        readStream.pipe(res)
    } catch (err) {
        console.error('Ошибка при отдаче файла:', err)
        res.status(500).json({ message: 'Неверный ID файла или ошибка базы данных' })
    }
}
