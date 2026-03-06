import { ref, readonly } from 'vue'
import { newsApi } from '@/api/news'
import type { IArticle, IArticlePayload } from '@/types'

const articles = ref<IArticle[]>([])
const currentArticle = ref<IArticle | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const editorDraft = ref<{
    title: string
    content: string
    status: string
    id: string | null
} | null>(null)

export function useNews() {
    async function fetchArticles(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const { data } = await newsApi.list()
            articles.value = data
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
            const { data } = await newsApi.get(id)
            currentArticle.value = data
            return data
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
            const { data } = await newsApi.create(payload)
            articles.value.unshift(data)
            return data
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
            const { data } = await newsApi.update(id, payload)

            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx !== -1) articles.value[idx] = data

            if (currentArticle.value?.id === id) currentArticle.value = data
            return data
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
            await newsApi.delete(id)
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
            const { data } = await newsApi.publish(id)
            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx !== -1) articles.value[idx] = data
            if (currentArticle.value?.id === id) currentArticle.value = data
            return data
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
            const { data } = await newsApi.schedule(id, publishAt)
            const idx = articles.value.findIndex((a) => a.id === id)
            if (idx !== -1) articles.value[idx] = data
            if (currentArticle.value?.id === id) currentArticle.value = data
            return data
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
        editorDraft,
        fetchArticles,
        fetchArticle,
        createArticle,
        updateArticle,
        deleteArticle,
        publishArticle,
        scheduleArticle
    }
}
