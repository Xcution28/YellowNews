<script setup lang="ts">
import { computed } from 'vue'
import type { TArticleStatus } from '@/types'

const props = defineProps<{ status: TArticleStatus }>()

const translatedStatus = computed(() => {
    const map: Record<TArticleStatus, string> = {
        draft: 'Черновик',
        scheduled: 'Запланировано',
        published: 'Опубликовано'
    }
    return map[props.status] || props.status
})
</script>
<template>
    <span class="badge" :class="`badge--${status}`">{{ translatedStatus }}</span>
</template>
