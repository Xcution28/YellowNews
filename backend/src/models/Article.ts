/**
 * @module Article
 * @description Схема Mongoose, интерфейс документа и модель для новостных статей.
 */

import { Schema, model, Document, Types } from 'mongoose'
import { ArticleStatus } from '../types'

/**
 * Интерфейс документа статьи (структура, хранящаяся в MongoDB).
 */
export interface IArticleDocument extends Document {
    title: string
    content: string
    status: ArticleStatus
    author: Types.ObjectId
    publishAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const articleSchema = new Schema<IArticleDocument>(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, default: '' },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'published'] as ArticleStatus[],
            default: 'draft'
        },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        publishAt: { type: Date, default: null }
    },
    { timestamps: true }
)

articleSchema.set('toJSON', {
    virtuals: true,
    transform(_doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    }
})

export const Article = model<IArticleDocument>('Article', articleSchema)
