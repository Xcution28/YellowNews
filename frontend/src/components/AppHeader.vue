<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import NotificationBell from './NotificationBell.vue'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

function handleLogout(): void {
    logout()
    router.push('/login')
}
</script>

<template>
    <header class="app-header">
        <div class="container app-header__inner">
            <router-link to="/news" class="app-header__logo">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="logo-icon"
                >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                <span class="logo-text">YellowNews</span>
            </router-link>

            <nav v-if="isAuthenticated" class="app-header__nav">
                <router-link to="/news" class="nav-link">Новости</router-link>
                <router-link to="/news/create" class="btn btn--primary btn--sm"
                    >+ Создать новость</router-link
                >
            </nav>

            <div v-if="isAuthenticated" class="app-header__actions">
                <NotificationBell />
                <div class="user-menu">
                    <span class="user-name">{{ user?.name }}</span>
                    <button class="btn btn--ghost btn--sm" @click="handleLogout">Выйти</button>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.app-header
  height: 60px
  border-bottom: 1px solid $color-border
  background: rgba($color-bg, 0.95)
  backdrop-filter: blur(12px)
  position: sticky
  top: 0
  z-index: 100

  &__inner
    height: 100%
    display: flex
    align-items: center
    gap: $space-lg

  &__logo
    display: flex
    align-items: center
    gap: $space-sm
    color: $color-primary
    font-weight: 700
    font-size: 1.1rem
    text-decoration: none
    transition: color $transition

    &:hover
      color: $color-primary-hover
      cursor: pointer

    .logo-icon
      font-size: 1.3rem

    .logo-text
      color: inherit

  &__nav
    display: flex
    align-items: center
    gap: $space-md
    margin-left: auto

    @media (max-width: 576px)
      display: none

  &__actions
    display: flex
    align-items: center
    gap: $space-md

.nav-link
  color: $text-secondary
  font-size: 0.9rem
  font-weight: 500
  transition: color $transition
  text-decoration: none

  &:hover,
  &.router-link-active
    color: $text-primary

.user-menu
  display: flex
  align-items: center
  gap: $space-sm

.user-name
  font-size: 0.85rem
  color: $text-secondary
</style>
