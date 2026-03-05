<script setup lang="ts">
import { useSlots } from 'vue'

withDefaults(
    defineProps<{
        modelValue: boolean
        title: string
        confirmLabel?: string
        cancelLabel?: string
        loading?: boolean
        disabled?: boolean
        confirmClass?: string
    }>(),
    {
        confirmLabel: 'Ок',
        cancelLabel: 'Отмена',
        loading: false,
        disabled: false,
        confirmClass: 'btn--primary'
    }
)

defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
}>()

const slots = useSlots()
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="modelValue"
                class="modal-backdrop"
                @click.self="$emit('update:modelValue', false)"
            >
                <div class="modal" role="dialog" aria-modal="true">
                    <div class="modal__header">
                        <h3 class="modal__title">{{ title }}</h3>
                        <button
                            class="btn btn--ghost btn--sm"
                            @click="$emit('update:modelValue', false)"
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
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div class="modal__body">
                        <slot></slot>
                    </div>

                    <div v-if="slots.footer" class="modal__footer">
                        <slot name="footer"></slot>
                    </div>
                    <div v-else class="modal__footer">
                        <button
                            class="btn btn--secondary"
                            @click="$emit('update:modelValue', false)"
                        >
                            {{ cancelLabel }}
                        </button>
                        <button
                            class="btn"
                            :class="confirmClass"
                            :disabled="loading || disabled"
                            @click="$emit('confirm')"
                        >
                            <span v-if="loading" class="spinner spinner--md"></span>
                            {{ confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.modal-backdrop
  position: fixed
  inset: 0
  background: rgba(0, 0, 0, 0.6)
  backdrop-filter: blur(4px)
  z-index: 500
  display: flex
  align-items: center
  justify-content: center
  padding: $space-lg

.modal
  background: $color-bg-card
  border: 1px solid $color-border
  border-radius: $radius-lg
  box-shadow: $shadow-modal
  width: 100%
  max-width: 440px
  overflow: hidden

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    padding: $space-lg
    border-bottom: 1px solid $color-border

  &__title
    font-size: 1rem
    font-weight: 600

  &__body
    padding: $space-lg

  &__message
    color: $text-secondary
    font-size: 0.9rem
    line-height: 1.6

  &__footer
    display: flex
    justify-content: flex-end
    gap: $space-sm
    padding: $space-md $space-lg
    border-top: 1px solid $color-border

.modal-enter-active, .modal-leave-active
  transition: opacity $transition-slow

.modal-enter-from, .modal-leave-to
  opacity: 0

.modal-enter-active .modal,
.modal-leave-active .modal
  transition: transform $transition-slow

.modal-enter-from .modal
  transform: scale(0.95) translateY(-10px)

.modal-leave-to .modal
  transform: scale(0.95) translateY(-10px)
</style>
