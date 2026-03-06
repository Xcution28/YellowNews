/**
 * @module types
 * @description Общие TypeScript типы и интерфейсы, используемые на бэкенде.
 */

import { Request } from 'express'
import { Types } from 'mongoose'

/** Возможные статусы публикации статьи */
export type ArticleStatus = 'draft' | 'scheduled' | 'published'

/** JWT payload, хранящийся внутри токена */
export interface JwtPayload {
    userId: string
}

/** Express Request, расширенный идентификатором аутентифицированного пользователя */
export interface AuthRequest extends Request {
    userId?: string
}
