<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNews } from '@/composables/useNews'
import { formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const { currentArticle, isLoading, fetchArticle } = useNews()

onMounted(async () => {
    if (route.params.id) {
        await fetchArticle(route.params.id as string)
    }
})
</script>

<template>
    <div class="view-page">
        <div class="container">
            <div class="view-page__nav">
                <button class="btn btn--ghost btn--sm" @click="router.push('/news')">
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
                    Ко всем новостям
                </button>
            </div>

            <div v-if="isLoading" class="loading-overlay">
                <div class="spinner"></div>
            </div>

            <article v-else-if="currentArticle" class="view-article">
                <header class="view-article__header">
                    <h1 class="view-article__title">{{ currentArticle.title }}</h1>
                    <div class="view-article__meta">
                        <span>Автор: {{ currentArticle.author?.name ?? 'Неизвестный' }}</span>
                        <time>{{
                            formatDateTime(
                                currentArticle.publishAt ?? currentArticle.createdAt,
                                'long'
                            )
                        }}</time>
                    </div>
                </header>

                <div
                    class="view-article__content tiptap-prose"
                    v-html="currentArticle.content"
                ></div>
            </article>

            <p v-else class="alert alert--error">Статья не найдена.</p>
        </div>
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.view-page
  padding: $space-xl 0 $space-2xl
  max-width: 780px
  margin: 0 auto

  &__nav
    display: flex
    align-items: center
    margin-bottom: $space-xl

.view-article
  &__header
    margin-bottom: $space-2xl
    display: flex
    flex-direction: column
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
