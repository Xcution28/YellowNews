/**
 * @module api/index
 * @description Точка входа для бессерверной функции Vercel — оборачивает Express-приложение как обработчик.
 *
 * ПРИМЕЧАНИЕ: События реального времени Socket.IO НЕ поддерживаются в Vercel serverless.
 * Для полноценной поддержки WebSocket используйте постоянный сервер (Railway, Render, Fly.io).
 */

import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'

import authRoutes from '../src/routes/auth'
import newsRoutes from '../src/routes/news'
import uploadRoutes from '../src/routes/upload'
import { errorMiddleware } from '../src/middleware/error'

const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? '*').split(',').map((s) => s.trim())

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/upload', uploadRoutes)
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }))
app.use(errorMiddleware)

// Переиспользование подключения mongoose между вызовами serverless-функции
let connected = false
async function ensureDB(): Promise<void> {
    if (!connected) {
        await mongoose.connect(process.env.MONGO_URI as string)
        connected = true
    }
}

export default async (req: Request, res: Response): Promise<void> => {
    await ensureDB()
    app(req, res)
}
