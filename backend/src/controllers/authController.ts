/**
 * @module authController
 * @description Обработчики для регистрации, авторизации и получения профиля пользователя.
 */

import { Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AuthRequest } from '../types'

/**
 * Генерирует подписанный JWT для указанного ID пользователя.
 * @param {string} userId - MongoDB ObjectId в виде строки
 * @returns {string} Подписанный JWT, действительный 7 дней
 */
function generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}

/**
 * Регистрирует новый аккаунт пользователя.
 *
 * @param {AuthRequest} req - Тело: `{ name, email, password }`
 * @param {Response} res - 201 с `{ token, user }`
 * @param {NextFunction} next
 */
export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, email, password } = req.body as {
            name?: string
            email?: string
            password?: string
        }

        if (!name || !email || !password) {
            res.status(400).json({ message: 'имя, email и пароль обязательны' })
            return
        }

        const existing = await User.findOne({ email })
        if (existing) {
            res.status(409).json({ message: 'Email уже используется' })
            return
        }

        const passwordHash = await bcrypt.hash(password, 12)
        const user = await User.create({ name, email, passwordHash })

        const token = generateToken((user._id as object).toString())
        res.status(201).json({ token, user })
    } catch (err) {
        next(err)
    }
}

/**
 * Аутентифицирует существующего пользователя и возвращает JWT.
 *
 * @param {AuthRequest} req - Тело: `{ email, password }`
 * @param {Response} res - 200 с `{ token, user }`
 * @param {NextFunction} next
 */
export async function login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body as { email?: string; password?: string }

        if (!email || !password) {
            res.status(400).json({ message: 'email и пароль обязательны' })
            return
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Неверные учетные данные' })
            return
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            res.status(401).json({ message: 'Неверные учетные данные' })
            return
        }

        const token = generateToken((user._id as object).toString())
        res.json({ token, user })
    } catch (err) {
        next(err)
    }
}

/**
 * Возвращает профиль текущего аутентифицированного пользователя.
 *
 * @param {AuthRequest} req - Должен иметь `req.userId`, установленный authMiddleware
 * @param {Response} res - 200 с объектом пользователя
 * @param {NextFunction} next
 */
export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' })
            return
        }
        res.json(user)
    } catch (err) {
        next(err)
    }
}
