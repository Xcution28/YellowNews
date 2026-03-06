/**
 * @module scheduler
 * @description задача node-cron, которая автоматически публикует статьи при наступлении времени `publishAt`.
 */

import cron from 'node-cron'
import { Article } from '../models/Article'
import { emitEvent } from '../sockets/notifier'

/**
 * Запускает задачу по расписанию.
 *
 * Запускается каждую минуту. Находит все статьи со статусом `status === 'scheduled'`
 * и `publishAt <= now`, устанавливает им статус `published` и вызывает событие Socket.IO.
 * @returns {void}
 */
export function startScheduler(): void {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date()
            const due = await Article.find({
                status: 'scheduled',
                publishAt: { $lte: now }
            })

            for (const article of due) {
                article.status = 'published'
                article.publishAt = null
                await article.save()
                emitEvent('article:published', { articleId: (article._id as object).toString() })
                console.log(`[scheduler] Опубликована статья ${String(article._id)}`)
            }
        } catch (err) {
            console.error('[scheduler] Ошибка:', (err as Error).message)
        }
    })

    console.log('[scheduler] Запущен — проверка каждую минуту')
}
