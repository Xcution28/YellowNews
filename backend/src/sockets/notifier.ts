/**
 * @module notifier
 * @description Генератор событий Socket.IO — хранит экземпляр сервера и экспортирует `emitEvent`.
 */

import { Server } from 'socket.io'

/** Поддерживаемые имена событий статьи (отражение frontend TNotificationEvent) */
export type ArticleEvent =
    | 'article:created'
    | 'article:updated'
    | 'article:deleted'
    | 'article:published'

/** Структура полезной нагрузки для всех событий статей */
export interface EventPayload {
    articleId?: string
}

let _io: Server | null = null

/**
 * Регистрирует сервер Socket.IO, чтобы `emitEvent` мог отправлять широковещательные сообщения.
 * Должен быть вызван один раз при загрузке сервера.
 *
 * @param {Server} io - Экземпляр сервера Socket.IO
 */
export function init(io: Server): void {
    _io = io
}

/**
 * Рассылает именованное событие статьи всем подключенным клиентам.
 *
 * @param {ArticleEvent} event - Имя события
 * @param {EventPayload} payload - Опциональная полезная нагрузка с `articleId`
 */
export function emitEvent(event: ArticleEvent, payload: EventPayload = {}): void {
    if (_io) {
        _io.emit(event, payload)
    }
}
