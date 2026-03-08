/**
 * @module index
 * @description Главный файл сервера Express + Socket.IO.
 * Инициализирует подключение к БД, Socket.IO, маршруты, планировщик и запускает HTTP-сервер.
 */

import 'dotenv/config'
import express from 'express'
import http from 'http'
import cors from 'cors'
import path from 'path'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { User } from './models/User'

import { connectDB } from './config/db'
import { setupSwagger } from './config/swagger'
import authRoutes from './routes/auth'
import newsRoutes from './routes/news'
import uploadRoutes from './routes/upload'
import { errorMiddleware } from './middleware/error'
import { init as initNotifier } from './sockets/notifier'
import { startScheduler } from './services/scheduler'

const app = express()
const server = http.createServer(app)

// CORS
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
            cb(new Error(`CORS: источник ${origin} не разрешен`))
        },
        credentials: true
    })
)

// Body Parser
app.use(express.json())

// Static Uploads (на проде используем GridFS)
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/upload', uploadRoutes)

// Health Check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Swagger UI
setupSwagger(app)

// Error Handler
app.use(errorMiddleware)

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
})

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token
        if (!token) {
            socket.data.role = 'guest'
            return next()
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
        const user = await User.findById(payload.userId)
        if (!user) {
            socket.data.role = 'guest'
            return next()
        }

        socket.data.userId = user.id
        socket.data.role = user.role
        next()
    } catch (err) {
        socket.data.role = 'guest'
        next()
    }
})

initNotifier(io)

io.on('connection', (socket) => {
    console.log(`[socket] Клиент подключен: ${socket.id}, User: ${socket.data.userId}, Role: ${socket.data.role}`)
    
    // Присоединяемся к комнате по ID пользователя и роли
    if (socket.data.userId) {
        socket.join(`user:${socket.data.userId}`)
    }
    if (socket.data.role === 'admin') {
        socket.join('admin')
    }

    socket.on('disconnect', () => {
        console.log(`[socket] Клиент отключен: ${socket.id}`)
    })
})

// Bootstrap
const PORT = Number(process.env.PORT) || 5000

async function bootstrap(): Promise<void> {
    await connectDB()
    startScheduler()
    server.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`)
    })
}

bootstrap()
