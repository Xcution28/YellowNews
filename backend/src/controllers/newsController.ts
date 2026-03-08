/**
 * @module newsController
 * @description Обработчики CRUD для новостных статей, а также действия для публикации и отложенного постинга.
 */
import { Response, NextFunction } from 'express'
import { Article } from '../models/Article'
import { User } from '../models/User'
import { AuthRequest, ArticleStatus } from '../types'
import { emitEvent } from '../sockets/notifier'

/** Структура тела запроса статьи */
interface ArticleBody {
    title?: string
    content?: string
    status?: ArticleStatus
    publishAt?: string | null
}

/**
 * Возвращает все статьи с заполненным именем и email автора, начиная с новых.
 *
 * @param {AuthRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await User.findById(req.userId)
        let query = {}
        if (user?.role !== 'admin') {
            query = { $or: [{ status: 'published' }, { author: req.userId }] }
        }

        const articles = await Article.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
        res.json(articles)
    } catch (err) {
        next(err)
    }
}

/**
 * Возвращает одну статью по ID.
 *
 * @param {AuthRequest} req - Params: `id`
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function getOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'name email')
        if (!article) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        const user = await User.findById(req.userId)
        const isAuthor = String((article.author as any)._id || article.author) === req.userId
        
        if (user?.role !== 'admin' && article.status !== 'published' && !isAuthor) {
            res.status(403).json({ message: 'Доступ запрещен' })
            return
        }

        res.json(article)
    } catch (err) {
        next(err)
    }
}

/**
 * Создает новую статью. По умолчанию статус `draft`.
 * Вызывает событие `article:created` через Socket.IO.
 *
 * @param {AuthRequest} req - Тело: `{ title, content?, status?, publishAt? }`
 * @param {Response} res - 201 с созданной статьей
 * @param {NextFunction} next
 */
export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title, content, status, publishAt } = req.body as ArticleBody

        if (!title) {
            res.status(400).json({ message: 'заголовок обязателен' })
            return
        }

        const article = await Article.create({
            title,
            content: content ?? '',
            status: status ?? 'draft',
            author: req.userId,
            publishAt: publishAt ?? null
        })

        await article.populate('author', 'name email')
        emitEvent('article:created', { 
            articleId: article.id as string,
            status: article.status,
            authorId: String((article.author as any)._id || article.author)
        })
        res.status(201).json(article)
    } catch (err) {
        next(err)
    }
}

/**
 * Частично обновляет статью.
 * Вызывает событие `article:updated` через Socket.IO.
 *
 * @param {AuthRequest} req - Параметры: `id`; Тело: частичные поля статьи
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title, content, status, publishAt } = req.body as ArticleBody

        const existingArticle = await Article.findById(req.params.id)
        if (!existingArticle) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        const user = await User.findById(req.userId)
        if (String(existingArticle.author) !== req.userId && user?.role !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещен' })
            return
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { title, content, status, publishAt },
            { new: true, runValidators: true }
        ).populate('author', 'name email')

        if (!article) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        emitEvent('article:updated', { 
            articleId: article.id as string,
            status: article.status,
            authorId: String((article.author as any)._id || article.author)
        })
        res.json(article)
    } catch (err) {
        next(err)
    }
}

/**
 * Удаляет статью по ID.
 * Вызывает событие `article:deleted` через Socket.IO.
 *
 * @param {AuthRequest} req - Параметры: `id`
 * @param {Response} res - 204 Нет содержимого
 * @param {NextFunction} next
 */
export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const existingArticle = await Article.findById(req.params.id)
        if (!existingArticle) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        const user = await User.findById(req.userId)
        if (String(existingArticle.author) !== req.userId && user?.role !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещен' })
            return
        }

        await Article.findByIdAndDelete(req.params.id)
        emitEvent('article:deleted', { 
            articleId: String(req.params.id),
            status: existingArticle.status,
            authorId: String(existingArticle.author)
        })
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

/**
 * Немедленно публикует статью (статус → 'published').
 * Вызывает событие `article:published` через Socket.IO.
 *
 * @param {AuthRequest} req - Параметры: `id`
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function publish(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const existingArticle = await Article.findById(req.params.id)
        if (!existingArticle) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        const user = await User.findById(req.userId)
        if (String(existingArticle.author) !== req.userId && user?.role !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещен' })
            return
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { status: 'published', publishAt: null },
            { new: true }
        ).populate('author', 'name email')

        if (!article) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        emitEvent('article:published', { 
            articleId: article.id as string,
            status: 'published',
            authorId: String((article.author as any)._id || article.author)
        })
        res.json(article)
    } catch (err) {
        next(err)
    }
}

/**
 * Планирует статью для будущей публикации (статус → 'scheduled').
 *
 * @param {AuthRequest} req - Параметры: `id`; Тело: `{ publishAt: ISODateString }`
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function schedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { publishAt } = req.body as { publishAt?: string }

        if (!publishAt) {
            res.status(400).json({ message: 'publishAt обязателен' })
            return
        }

        const date = new Date(publishAt)
        if (isNaN(date.getTime())) {
            res.status(400).json({ message: 'publishAt должен быть валидной строкой ISO даты' })
            return
        }

        const existingArticle = await Article.findById(req.params.id)
        if (!existingArticle) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        const user = await User.findById(req.userId)
        if (String(existingArticle.author) !== req.userId && user?.role !== 'admin') {
            res.status(403).json({ message: 'Доступ запрещен' })
            return
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { status: 'scheduled', publishAt: date },
            { new: true }
        ).populate('author', 'name email')

        if (!article) {
            res.status(404).json({ message: 'Статья не найдена' })
            return
        }

        res.json(article)
    } catch (err) {
        next(err)
    }
}
