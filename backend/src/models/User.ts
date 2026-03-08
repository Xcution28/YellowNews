/**
 * @module User
 * @description Схема Mongoose, интерфейс документа и модель для пользователей приложения.
 */

import { Schema, model, Document } from 'mongoose'

/**
 * Интерфейс документа пользователя (структура, хранящаяся в MongoDB).
 */
export interface IUserDocument extends Document {
    name: string
    email: string
    passwordHash: string
    role: 'user' | 'admin'
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { timestamps: true }
)

/**
 * Сериализация пользователя в виде простого объекта, скрывая passwordHash и внутренние поля.
 */
userSchema.set('toJSON', {
    virtuals: true,
    transform(_doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
    }
})

export const User = model<IUserDocument>('User', userSchema)
