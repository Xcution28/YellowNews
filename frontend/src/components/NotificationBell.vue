<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { formatTime } from '@/utils/date'

const { notifications, unreadCount, markAllRead, markRead } = useNotifications()
const isOpen = ref(false)
const bellRef = ref<HTMLElement | null>(null)

function toggleOpen(): void {
    isOpen.value = !isOpen.value
}

function handleClickOutside(e: MouseEvent): void {
    if (bellRef.value && !bellRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div ref="bellRef" class="notif-bell">
        <button class="notif-bell__btn" :class="{ active: isOpen }" @click="toggleOpen">
            <span class="notif-bell__icon">
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
                >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
            </span>
            <span v-if="unreadCount() > 0" class="notif-bell__badge">{{ unreadCount() }}</span>
        </button>

        <Transition name="dropdown">
            <div v-if="isOpen" class="notif-dropdown">
                <div class="notif-dropdown__header">
                    <span>Уведомления</span>
                    <button class="btn btn--ghost btn--sm" @click="markAllRead">
                        Прочитать все
                    </button>
                </div>

                <div class="notif-dropdown__body">
                    <div v-if="notifications.length === 0" class="notif-empty">Нет уведомлений</div>
                    <TransitionGroup name="notif-item" tag="ul" class="notif-list">
                        <li
                            v-for="n in notifications"
                            :key="n.id"
                            class="notif-item"
                            :class="{ unread: !n.read }"
                            @click="markRead(n.id)"
                        >
                            <span class="notif-item__dot"></span>
                            <div class="notif-item__content">
                                <p class="notif-item__msg">{{ n.message }}</p>
                                <time class="notif-item__time">{{ formatTime(n.timestamp) }}</time>
                            </div>
                        </li>
                    </TransitionGroup>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.notif-bell
  position: relative

  &__btn
    position: relative
    background: transparent
    border: none
    font-size: 1.2rem
    padding: $space-xs
    border-radius: $radius-md
    cursor: pointer
    transition: transform $transition

    &:hover, &.active
      transform: scale(1.1)

  &__badge
    position: absolute
    top: -2px
    right: -4px
    background: $color-danger
    color: #fff
    font-size: 0.65rem
    font-weight: 700
    min-width: 18px
    height: 18px
    border-radius: $radius-pill
    display: flex
    align-items: center
    justify-content: center
    padding: 0 4px

.notif-dropdown
  position: absolute
  top: calc(100% + 8px)
  right: 0
  width: 320px
  background: $color-bg-card
  border: 1px solid $color-border
  border-radius: $radius-lg
  box-shadow: $shadow-modal
  z-index: 200
  overflow: hidden

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    padding: $space-md
    border-bottom: 1px solid $color-border
    font-weight: 600
    font-size: 0.9rem

  &__body
    max-height: 360px
    overflow-y: auto

.notif-empty
  padding: $space-xl
  text-align: center
  color: $text-muted
  font-size: 0.875rem

.notif-list
  list-style: none
  padding: $space-sm

.notif-item
  display: flex
  gap: $space-sm
  padding: $space-sm $space-md
  border-radius: $radius-md
  cursor: pointer
  transition: background $transition

  &:hover
    background: rgba(255, 255, 255, 0.04)

  &.unread .notif-item__dot
    background: $color-primary

  &__dot
    width: 8px
    height: 8px
    border-radius: 50%
    background: $color-border
    flex-shrink: 0
    margin-top: 5px
    transition: background $transition

  &__content
    flex: 1
    min-width: 0

  &__msg
    font-size: 0.85rem
    color: $text-primary
    line-height: 1.4

  &__time
    font-size: 0.75rem
    color: $text-muted
    margin-top: 2px
    display: block

.dropdown-enter-active, .dropdown-leave-active
  transition: opacity $transition, transform $transition

.dropdown-enter-from, .dropdown-leave-to
  opacity: 0
  transform: translateY(-8px)

.notif-item-enter-active
  transition: all 300ms ease

.notif-item-enter-from
  opacity: 0
  transform: translateX(-12px)
</style>
