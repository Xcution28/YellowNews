<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useNews } from '@/composables/useNews'
import { useAuth } from '@/composables/useAuth'
import TipTapEditor from '@/components/TipTapEditor.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ScheduleModal from '@/components/ScheduleModal.vue'
import type { TArticleStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const { fetchArticle, createArticle, updateArticle, publishArticle, scheduleArticle, editorDraft } =
    useNews()
const { user } = useAuth()

const isEditing = computed(() => !!route.params.id)
const savedId = ref<string | null>(isEditing.value ? (route.params.id as string) : null)
const pageLoading = ref(false)
const isSaving = ref<'draft' | 'publish' | 'schedule' | false>(false)
const saveError = ref('')
const showSchedule = ref(false)

const form = reactive<{ title: string; content: string; status: TArticleStatus }>({
    title: '',
    content: '',
    status: 'draft'
})

watch(
    form,
    (val) => {
        editorDraft.value = {
            title: val.title,
            content: val.content,
            status: val.status,
            id: savedId.value
        }
    },
    { deep: true }
)

async function saveDraft(): Promise<void> {
    if (!form.title.trim()) {
        saveError.value = 'Заголовок обязателен'
        return
    }
    saveError.value = ''
    isSaving.value = 'draft'
    try {
        if (savedId.value) {
            await updateArticle(savedId.value, { title: form.title, content: form.content })
        } else {
            const created = await createArticle({
                title: form.title,
                content: form.content,
                status: 'draft'
            })
            if (created) {
                savedId.value = created.id
                router.replace(`/news/${created.id}/edit`)
            }
        }
        form.status = 'draft'
    } finally {
        isSaving.value = false
    }
}

async function handlePublish(): Promise<void> {
    if (!form.title.trim()) {
        saveError.value = 'Заголовок обязателен'
        return
    }
    saveError.value = ''
    isSaving.value = 'publish'
    try {
        if (!savedId.value) {
            const created = await createArticle({
                title: form.title,
                content: form.content,
                status: 'draft'
            })
            if (created) savedId.value = created.id
            else return
        } else {
            await updateArticle(savedId.value, { title: form.title, content: form.content })
        }
        if (savedId.value) {
            await publishArticle(savedId.value)
            form.status = 'published'
        }
    } finally {
        isSaving.value = false
    }
}

async function handleSchedule(isoDate: string): Promise<void> {
    if (!form.title.trim()) {
        saveError.value = 'Заголовок обязателен'
        return
    }
    saveError.value = ''
    isSaving.value = 'schedule'
    try {
        if (!savedId.value) {
            const created = await createArticle({
                title: form.title,
                content: form.content,
                status: 'draft'
            })
            if (created) savedId.value = created.id
            else return
        } else {
            await updateArticle(savedId.value, { title: form.title, content: form.content })
        }
        if (savedId.value) {
            await scheduleArticle(savedId.value, isoDate)
            form.status = 'scheduled'
            showSchedule.value = false
        }
    } finally {
        isSaving.value = false
    }
}

function goPreview(): void {
    const previewData = {
        title: form.title,
        content: form.content,
        status: form.status
    }
    const path = savedId.value ? `/news/preview/${savedId.value}` : '/news/preview'
    router.push({
        path,
        state: { previewData: JSON.stringify(previewData) }
    })
}

onMounted(async () => {
    const isSameDraft =
        editorDraft.value &&
        editorDraft.value.id === (route.params.id ? (route.params.id as string) : null)

    if (isSameDraft) {
        form.title = editorDraft.value!.title
        form.content = editorDraft.value!.content
        form.status = editorDraft.value!.status as TArticleStatus
    } else {
        editorDraft.value = null
        if (isEditing.value && route.params.id) {
            pageLoading.value = true
            const article = await fetchArticle(route.params.id as string)
            if (article) {
                if (user.value?.role !== 'admin' && user.value?.id !== article.author.id) {
                    router.replace('/news')
                    return
                }
                form.title = article.title
                form.content = article.content
                form.status = article.status
            }
            pageLoading.value = false
        }
    }
})

onBeforeRouteLeave((to, _from, next) => {
    if (to.name !== 'news-preview') {
        editorDraft.value = null
    }
    next()
})
</script>

<template>
    <div class="editor-page">
        <div class="container">
            <div class="page-header">
                <div class="editor-page__breadcrumb">
                    <router-link to="/news" class="btn btn--ghost btn--sm">
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
                        Назад
                    </router-link>
                    <h1>{{ isEditing ? 'Редактировать статью' : 'Новая статья' }}</h1>
                </div>
                <StatusBadge v-if="form.status" :status="form.status" />
            </div>

            <div v-if="pageLoading" class="loading-overlay">
                <div class="spinner"></div>
            </div>

            <template v-else>
                <div class="form-group mb-lg">
                    <input
                        v-model="form.title"
                        class="editor-title-input"
                        type="text"
                        placeholder="Заголовок статьи..."
                        maxlength="200"
                    />
                </div>

                <TipTapEditor v-model="form.content" class="mb-lg" />

                <p v-if="saveError" class="alert alert--error mb-md">
                    {{ saveError }}
                </p>

                <div class="editor-actions">
                    <button class="btn btn--secondary" :disabled="!!isSaving" @click="saveDraft">
                        <span v-if="isSaving === 'draft'" class="spinner spinner--sm"></span>
                        Сохранить черновик
                    </button>

                    <button class="btn btn--ghost" @click="goPreview">
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
                            class="icon-text"
                        >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Предпросмотр
                    </button>

                    <div class="editor-actions__right">
                        <button
                            class="btn btn--secondary"
                            :disabled="!!isSaving"
                            @click="showSchedule = true"
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
                                class="icon-text"
                            >
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                <line x1="16" x2="16" y1="2" y2="6"></line>
                                <line x1="8" x2="8" y1="2" y2="6"></line>
                                <line x1="3" x2="21" y1="10" y2="10"></line>
                            </svg>
                            Запланировать
                        </button>
                        <button
                            class="btn btn--primary"
                            :disabled="!!isSaving"
                            @click="handlePublish"
                        >
                            <span v-if="isSaving === 'publish'" class="spinner spinner--sm"></span>
                            Опубликовать
                        </button>
                    </div>
                </div>

                <ScheduleModal
                    v-model="showSchedule"
                    :loading="isSaving === 'schedule'"
                    @schedule="handleSchedule"
                />
            </template>
        </div>
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.editor-page
  padding: $space-xl 0 $space-2xl

  &__breadcrumb
    display: flex
    align-items: center
    gap: $space-md

.editor-title-input
  width: 100%
  background: transparent
  border: none
  border-bottom: 1px solid $color-border
  color: $text-primary
  font-size: 1.8rem
  font-weight: 700
  padding: $space-sm 0
  outline: none
  font-family: $font-sans
  transition: border-color $transition

  &:focus
    border-bottom-color: $color-primary

  &::placeholder
    color: $text-muted

.editor-actions
  display: flex
  align-items: center
  gap: $space-sm
  flex-wrap: wrap

  &__right
    display: flex
    gap: $space-sm
    margin-left: auto
</style>
