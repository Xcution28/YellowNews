import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import upload from '../utils/multerConfig'
import { uploadFile } from '../controllers/uploadController'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Загрузка файлов
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Загрузка файла (изображения)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Файл для загрузки (JPEG, PNG, GIF, WEBP)
 *     responses:
 *       200:
 *         description: Файл успешно загружен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Путь к загруженному файлу
 *       400:
 *         description: Ошибка загрузки (неверный формат или нет файла)
 */
router.post('/', authMiddleware, upload.single('file'), uploadFile)

export default router
