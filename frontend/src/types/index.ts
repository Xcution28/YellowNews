export type TArticleStatus = 'draft' | 'scheduled' | 'published'

export interface IUser {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
}

export interface IArticle {
    id: string
    title: string
    content: string
    status: TArticleStatus
    author: IUser
    publishAt?: string | null
    createdAt: string
    updatedAt: string
}

export interface IArticlePayload {
    title: string
    content: string
    status?: TArticleStatus
    publishAt?: string | null
}

export interface IAuthCredentials {
    email: string
    password: string
}

export interface IRegisterPayload extends IAuthCredentials {
    name: string
}

export interface IAuthResponse {
    token: string
    user: IUser
}

export interface IUploadResponse {
    url: string
    filename: string
}

export type TNotificationEvent =
    | 'article:created'
    | 'article:updated'
    | 'article:deleted'
    | 'article:published'

export interface INotification {
    id: string
    event: TNotificationEvent
    message: string
    articleId?: string
    timestamp: Date
    read: boolean
}
