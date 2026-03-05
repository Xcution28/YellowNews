<script setup lang="ts">
import BaseModal from '@/components/BaseModal.vue'

withDefaults(
    defineProps<{
        modelValue: boolean
        title?: string
        message?: string
        confirmLabel?: string
        loading?: boolean
    }>(),
    {
        title: 'Подтверждение',
        message: 'Вы уверены?',
        confirmLabel: 'Подтвердить',
        loading: false
    }
)

defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
}>()
</script>

<template>
    <BaseModal
        :model-value="modelValue"
        :title="title"
        :confirm-label="confirmLabel"
        :loading="loading"
        confirm-class="btn--danger"
        @update:model-value="$emit('update:modelValue', $event)"
        @confirm="$emit('confirm')"
    >
        <p class="modal__message">{{ message }}</p>
    </BaseModal>
</template>

<style lang="sass"></style>
