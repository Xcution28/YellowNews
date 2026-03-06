/**
 * @module db
 * @description Подключение к MongoDB через Mongoose.
 */

import mongoose from 'mongoose'

/**
 * Подключается к MongoDB, используя переменную окружения MONGO_URI.
 * Завершает процесс в случае ошибки подключения.
 * @returns {Promise<void>}
 */
export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('Подключено к MongoDB')
    } catch (err) {
        console.error('Ошибка подключения к MongoDB:', (err as Error).message)
        process.exit(1)
    }
}
