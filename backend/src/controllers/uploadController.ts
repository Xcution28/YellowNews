/**
 * @module uploadController
 * @description Обрабатывает загрузку файлов через multer и возвращает публичный URL.
 */

import { Response } from 'express'
import { AuthRequest } from '../types'

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

    const url = `/uploads/${req.file.filename}`
    res.status(201).json({ url, filename: req.file.filename })
}
