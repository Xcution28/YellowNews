import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { list, getOne, create, update, remove, publish, schedule } from '../controllers/newsController'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Управление новостными статьями
 */

router.use(authMiddleware)

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Получение списка статей
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество статей на странице
 *     responses:
 *       200:
 *         description: Список статей
 *       401:
 *         description: Не авторизован
 */
router.get('/', list)

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Получение одной статьи по ID
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статьи
 *     responses:
 *       200:
 *         description: Статья найдена
 *       404:
 *         description: Статья не найдена
 */
router.get('/:id', getOne)

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Создание новой статьи
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Статья создана
 */
router.post('/', create)

/**
 * @swagger
 * /api/news/{id}:
 *   patch:
 *     summary: Обновление статьи
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Статья обновлена
 */
router.patch('/:id', update)

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Удаление статьи
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статья удалена
 */
router.delete('/:id', remove)

/**
 * @swagger
 * /api/news/{id}/publish:
 *   post:
 *     summary: Мгновенная публикация статьи
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статья опубликована
 */
router.post('/:id/publish', publish)

/**
 * @swagger
 * /api/news/{id}/schedule:
 *   post:
 *     summary: Запланировать публикацию статьи
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publishAt
 *             properties:
 *               publishAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Статья запланирована
 */
router.post('/:id/schedule', schedule)

export default router
