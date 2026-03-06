/**
 * @module authMiddleware
 * @description Проверяет Bearer JWT из заголовка Authorization 
 * и прикрепляет `userId` к объекту запроса.
 */

import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest, JwtPayload } from '../types'

/**
 * Защищает маршруты путем проверки Bearer JWT токена.
 *
 * @param {AuthRequest} req - Запрос Express, расширенный `userId`
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Токен не предоставлен' })
        return
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.userId = payload.userId
        next()
    } catch {
        res.status(401).json({ message: 'Недействительный или просроченный токен' })
    }
}
