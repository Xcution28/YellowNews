import api from './axios'
import type { IArticle, IArticlePayload } from '@/types'

export const newsApi = {
    list: () => api.get<IArticle[]>('/api/news'),

    get: (id: string) => api.get<IArticle>(`/api/news/${id}`),

    create: (payload: IArticlePayload) => api.post<IArticle>('/api/news', payload),

    update: (id: string, payload: Partial<IArticlePayload>) =>
        api.patch<IArticle>(`/api/news/${id}`, payload),

    delete: (id: string) => api.delete(`/api/news/${id}`),

    publish: (id: string) => api.post<IArticle>(`/api/news/${id}/publish`),

    schedule: (id: string, publishAt: string) =>
        api.post<IArticle>(`/api/news/${id}/schedule`, { publishAt })
}
