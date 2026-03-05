import { ref, readonly } from 'vue'
// import { newsApi } from '@/api/news'
import type { IArticle, IArticlePayload } from '@/types'
import { mockArticles, mockUser } from '@/mock/data'

const articles = ref<IArticle[]>([...mockArticles])
const currentArticle = ref<IArticle | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export function useNews() {
    async function fetchArticles(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // const { data } = await newsApi.list()
            // articles.value = data
        } catch {
            error.value = 'Не удалось загрузить статьи'
        } finally {
            isLoading.value = false
        }
    }

    async function fetchArticle(id: string): Promise<IArticle | null> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // const { data } = await newsApi.get(id)
            // currentArticle.value = data
            // return data

            const found = articles.value.find((a) => a.id === id) || null
            currentArticle.value = found
            return found
        } catch {
            error.value = 'Не удалось загрузить статью'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function createArticle(payload: IArticlePayload): Promise<IArticle | null> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // const { data } = await newsApi.create(payload)
            // articles.value.unshift(data)
            // return data

            const newArticle: IArticle = {
                id: `art_${Date.now()}`,
                title: payload.title,
                content: payload.content,
                status: payload.status || 'draft',
                author: mockUser,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishAt: payload.publishAt || null
            }
            articles.value.unshift(newArticle)
            return newArticle
        } catch {
            error.value = 'Не удалось создать статью'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function updateArticle(
        id: string,
        payload: Partial<IArticlePayload>
    ): Promise<IArticle | null> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx === -1) throw new Error('Не найдено')

            const updatedStr = new Date().toISOString()
            const updated: IArticle = {
                ...articles.value[idx],
                ...payload,
                updatedAt: updatedStr
            } as IArticle

            articles.value[idx] = updated
            if (currentArticle.value?.id === id) currentArticle.value = updated
            return updated
        } catch {
            error.value = 'Не удалось обновить статью'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function deleteArticle(id: string): Promise<boolean> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // await newsApi.delete(id)
            // articles.value = articles.value.filter((a) => a._id !== id)
            // return true

            articles.value = articles.value.filter((a) => a.id !== id)
            if (currentArticle.value?.id === id) currentArticle.value = null
            return true
        } catch {
            error.value = 'Не удалось удалить статью'
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function publishArticle(id: string): Promise<IArticle | null> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // const { data } = await newsApi.publish(id)
            // const idx = articles.value.findIndex((a) => a._id === id)
            // if (idx !== -1) articles.value[idx] = data
            // if (currentArticle.value?._id === id) currentArticle.value = data
            // return data

            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx === -1) throw new Error('Не найдено')

            const str = new Date().toISOString()
            const updated: IArticle = {
                ...articles.value[idx],
                status: 'published',
                publishAt: str,
                updatedAt: str
            } as IArticle

            articles.value[idx] = updated
            if (currentArticle.value?.id === id) currentArticle.value = updated
            return updated
        } catch {
            error.value = 'Не удалось опубликовать статью'
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function scheduleArticle(id: string, publishAt: string): Promise<IArticle | null> {
        isLoading.value = true
        error.value = null
        try {
            await delay()
            // вызов API
            // const { data } = await newsApi.schedule(id, publishAt)
            // const idx = articles.value.findIndex((a) => a._id === id)
            // if (idx !== -1) articles.value[idx] = data
            // if (currentArticle.value?._id === id) currentArticle.value = data
            // return data

            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx === -1) throw new Error('Не найдено')

            const str = new Date().toISOString()
            const updated: IArticle = {
                ...articles.value[idx],
                status: 'scheduled',
                publishAt,
                updatedAt: str
            } as IArticle

            articles.value[idx] = updated
            if (currentArticle.value?.id === id) currentArticle.value = updated
            return updated
        } catch {
            error.value = 'Не удалось запланировать публикацию'
            return null
        } finally {
            isLoading.value = false
        }
    }

    return {
        articles: readonly(articles),
        currentArticle: readonly(currentArticle),
        isLoading: readonly(isLoading),
        error: readonly(error),
        fetchArticles,
        fetchArticle,
        createArticle,
        updateArticle,
        deleteArticle,
        publishArticle,
        scheduleArticle
    }
}
