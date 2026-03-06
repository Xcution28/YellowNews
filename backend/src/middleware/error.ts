/**
 * @module errorMiddleware
 * @description Глобальный обработчик ошибок Express.
 */

import { Request, Response, NextFunction } from 'express'

/**
 * Перехватывает любые необработанные ошибки, переданные через `next(err)`, и возвращает ответ в формате JSON.
 *
 * @param {Error} err - Перехваченная ошибка
 * @param {Request} _req
 * @param {Response} res
 * @param {NextFunction} _next
 */
export function errorMiddleware(
    err: Error & { status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error(err)
    const status = err.status ?? 500
    const message = err.message ?? 'Внутренняя ошибка сервера'
    res.status(status).json({ message })
}
