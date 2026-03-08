<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNews } from '@/composables/useNews'
import StatusBadge from '@/components/StatusBadge.vue'
import { formatDateTime } from '@/utils/date'
import type { IArticle } from '@/types'

const route = useRoute()
const router = useRouter()
const { currentArticle, isLoading, fetchArticle } = useNews()

const localArticle = ref<IArticle | null>(null)

const displayArticle = computed(() => localArticle.value || currentArticle.value)

onMounted(async () => {
    const previewState = history.state?.previewData
    if (previewState) {
        try {
            const data = JSON.parse(previewState)
            localArticle.value = {
                id: (route.params.id as string) || 'draft',
                title: data.title,
                content: data.content,
                status: data.status,
                author: {
                    id: 'local',
                    name: 'Вы (Предпросмотр)',
                    email: '',
                    role: 'user'
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        } catch (e) {
            console.error('Ошибка при загрузке предпросмотра', e)
        }
    } else if (route.params.id) {
        await fetchArticle(route.params.id as string)
    }
})
</script>

<template>
    <div class="preview-page">
        <div class="container">
            <div class="preview-page__nav">
                <button class="btn btn--ghost btn--sm" @click="router.back()">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Назад в редактор
                </button>
                <span class="badge badge--draft ml-auto">Режим просмотра</span>
            </div>

            <div v-if="isLoading" class="loading-overlay">
                <div class="spinner"></div>
            </div>

            <article v-else-if="displayArticle" class="preview-article">
                <header class="preview-article__header">
                    <StatusBadge :status="displayArticle.status" />
                    <h1 class="preview-article__title">{{ displayArticle.title }}</h1>
                    <div class="preview-article__meta">
                        <span>Автор: {{ displayArticle.author?.name ?? 'Неизвестный' }}</span>
                        <time>{{
                            formatDateTime(
                                displayArticle.publishAt ?? displayArticle.createdAt,
                                'long'
                            )
                        }}</time>
                    </div>
                </header>

                <div
                    class="preview-article__content tiptap-prose"
                    v-html="displayArticle.content"
                ></div>
            </article>

            <p v-else class="alert alert--error">Статья не найдена.</p>
        </div>
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.preview-page
  padding: $space-xl 0 $space-2xl
  max-width: 780px
  margin: 0 auto

  &__nav
    display: flex
    align-items: center
    margin-bottom: $space-xl

.preview-article
  &__header
    text-align: center
    margin-bottom: $space-2xl
    display: flex
    flex-direction: column
    align-items: center
    gap: $space-md

  &__title
    font-size: 2.4rem
    font-weight: 800
    line-height: 1.25
    color: $text-primary

  &__meta
    display: flex
    gap: $space-lg
    color: $text-muted
    font-size: 0.875rem

  &__content
    font-size: 1.05rem
    line-height: 1.9
</style>
