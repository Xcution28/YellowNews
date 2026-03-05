<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNews } from '@/composables/useNews'
import { useSocket } from '@/composables/useSocket'
import ArticleCard from '@/components/ArticleCard.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { TArticleStatus } from '@/types'

const router = useRouter()
const { articles, isLoading, error, fetchArticles, deleteArticle } = useNews()
const { connect } = useSocket()

interface IFilter {
    label: string
    value: TArticleStatus | 'all'
}
const filters: IFilter[] = [
    { label: 'Все', value: 'all' },
    { label: 'Черновики', value: 'draft' },
    { label: 'Запланированные', value: 'scheduled' },
    { label: 'Опубликованные', value: 'published' }
]

const activeFilter = ref<TArticleStatus | 'all'>('all')
const showDeleteModal = ref(false)
const pendingDeleteId = ref<string | null>(null)

const filteredArticles = computed(() =>
    activeFilter.value === 'all'
        ? articles.value
        : articles.value.filter((a) => a.status === activeFilter.value)
)

function promptDelete(id: string): void {
    pendingDeleteId.value = id
    showDeleteModal.value = true
}

async function confirmDelete(): Promise<void> {
    if (!pendingDeleteId.value) return
    await deleteArticle(pendingDeleteId.value)
    showDeleteModal.value = false
    pendingDeleteId.value = null
}

onMounted(() => {
    fetchArticles()
    connect()
})
</script>

<template>
    <div class="news-list-page">
        <div class="container">
            <div class="page-header">
                <h1>Новости</h1>
                <router-link to="/news/create" class="btn btn--primary"
                    >+ Создать новость</router-link
                >
            </div>

            <div class="filter-bar">
                <button
                    v-for="f in filters"
                    :key="f.value"
                    class="filter-btn"
                    :class="{ active: activeFilter === f.value }"
                    @click="activeFilter = f.value"
                >
                    {{ f.label }}
                </button>
            </div>

            <div v-if="isLoading" class="loading-overlay">
                <div class="spinner"></div>
            </div>
            <p v-else-if="error" class="alert alert--error">{{ error }}</p>

            <div v-else-if="filteredArticles.length === 0" class="empty-state">
                <p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon-text-lg"
                    >
                        <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                        ></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Ничего не найдено.
                    <router-link to="/news/create">Создайте первую статью!</router-link>
                </p>
            </div>

            <TransitionGroup v-else name="grid" tag="div" class="articles-grid">
                <ArticleCard
                    v-for="article in filteredArticles"
                    :key="article.id"
                    :article="article"
                    @open="(id) => router.push(`/news/${id}/edit`)"
                    @edit="(id) => router.push(`/news/${id}/edit`)"
                    @preview="(id) => router.push(`/news/${id}/preview`)"
                    @delete="promptDelete"
                />
            </TransitionGroup>
        </div>

        <ConfirmModal
            v-model="showDeleteModal"
            title="Удалить статью"
            message="Это действие необратимо. Вы действительно хотите удалить эту статью?"
            confirm-label="Удалить"
            :loading="isLoading"
            @confirm="confirmDelete"
        />
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.news-list-page
  padding: $space-xl 0 $space-2xl

.filter-bar
  display: flex
  overflow-x: auto
  gap: $space-sm
  margin-bottom: $space-xl
  padding-bottom: 4px
  scrollbar-width: none
  &::-webkit-scrollbar
    display: none

.filter-btn
  padding: $space-xs $space-md
  border-radius: $radius-pill
  border: 1px solid $color-border
  background: transparent
  color: $text-secondary
  font-size: 0.85rem
  cursor: pointer
  transition: all $transition
  white-space: nowrap
  flex-shrink: 0

  &:hover
    border-color: $color-primary
    color: $color-primary

  &.active
    background: $color-primary
    border-color: $color-primary
    color: #000
    font-weight: 600

.articles-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr))
  gap: $space-lg

.empty-state
  text-align: center
  padding: $space-2xl
  color: $text-muted
  font-size: 1rem

.grid-enter-active, .grid-leave-active
  transition: all $transition-slow

.grid-enter-from, .grid-leave-to
  opacity: 0
  transform: translateY(12px)
</style>
