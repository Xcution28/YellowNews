/**
 * @module multerConfig
 * @description Конфигурация хранилища Multer v2 для загрузки файлов.
 */

import multer from 'multer'
import path from 'path'
import fs from 'fs'


// // Статическая загрузка (локально)
// const UPLOAD_DIR = path.join(__dirname, '../../uploads')

// // Убедиться, что папка для загрузок существует при запуске
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR, { recursive: true })
// }

// const storage = multer.diskStorage({
//     destination(_req, _file, cb) {
//         cb(null, UPLOAD_DIR)
//     },
//     filename(_req, file, cb) {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
//         const ext = path.extname(file.originalname)
//         cb(null, `${uniqueSuffix}${ext}`)
//     }
// })


const storage = multer.memoryStorage()

/** Разрешенные MIME-типы для загрузки */
const ALLOWED_MIMES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

const upload = multer({
    storage,
    fileFilter(_req, file, cb) {
        if (ALLOWED_MIMES.has(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Неподдерживаемый тип файла'))
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
})

export default upload
