<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/BaseModal.vue'

withDefaults(
    defineProps<{
        modelValue: boolean
        loading?: boolean
    }>(),
    { loading: false }
)

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    schedule: [isoDate: string]
}>()

const dateValue = ref('')
const error = ref('')

const minDate = computed(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
})

function handleConfirm(): void {
    if (!dateValue.value) {
        error.value = 'Выберите дату'
        return
    }
    const selected = new Date(dateValue.value)
    if (selected <= new Date()) {
        error.value = 'Выберите будущую дату'
        return
    }
    error.value = ''
    emit('schedule', selected.toISOString())
}
</script>
<template>
    <BaseModal
        :model-value="modelValue"
        title="Запланировать публикацию"
        confirm-label="Запланировать"
        :loading="loading"
        :disabled="!dateValue"
        @update:model-value="$emit('update:modelValue', $event)"
        @confirm="handleConfirm"
    >
        <div class="form-group">
            <label class="form-label">Дата и время публикации</label>
            <input v-model="dateValue" type="datetime-local" class="form-input" :min="minDate" />
        </div>
        <p v-if="error" class="form-error mt-sm">{{ error }}</p>
    </BaseModal>
</template>
<style lang="sass"></style>
