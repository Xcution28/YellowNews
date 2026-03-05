<script setup lang="ts">
import type { IArticle } from '@/types'
import StatusBadge from './StatusBadge.vue'
import { formatDate } from '@/utils/date'

defineProps<{ article: IArticle }>()
defineEmits<{
    open: [id: string]
    edit: [id: string]
    preview: [id: string]
    delete: [id: string]
}>()
</script>

<template>
    <article class="article-card" @click="$emit('open', article.id)">
        <div class="article-card__header">
            <StatusBadge :status="article.status" />
            <time class="article-card__date">{{
                formatDate(article.publishAt ?? article.createdAt)
            }}</time>
        </div>

        <h2 class="article-card__title">{{ article.title || 'Без названия' }}</h2>

        <div class="article-card__meta">
            <span class="article-card__author flex items-center gap-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ article.author?.name ?? 'Неизвестный' }}
            </span>
        </div>

        <div class="article-card__actions" @click.stop>
            <button
                class="btn btn--ghost btn--sm"
                title="Редактировать"
                @click="$emit('edit', article.id)"
            >
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
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Изменить</span>
            </button>
            <button
                class="btn btn--ghost btn--sm"
                title="Просмотр"
                @click="$emit('preview', article.id)"
            >
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
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Просмотр</span>
            </button>
            <button
                class="btn btn--danger btn--sm"
                title="Удалить"
                @click="$emit('delete', article.id)"
            >
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
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Удалить</span>
            </button>
        </div>
    </article>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.article-card
  background: $color-bg-card
  border: 1px solid $color-border
  border-radius: $radius-lg
  padding: $space-lg
  cursor: pointer
  transition: all $transition-slow
  display: flex
  flex-direction: column
  gap: $space-md

  &:hover
    border-color: rgba($color-primary, 0.35)
    transform: translateY(-2px)
    box-shadow: $shadow-card

  &__header
    display: flex
    align-items: center
    justify-content: space-between

  &__date
    font-size: 0.78rem
    color: $text-muted

  &__title
    font-size: 1.1rem
    font-weight: 600
    color: $text-primary
    line-height: 1.4
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden

  &__meta
    font-size: 0.8rem
    color: $text-muted

  &__actions
    display: flex
    gap: $space-xs
    margin-top: auto
</style>
