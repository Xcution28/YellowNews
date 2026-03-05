<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'

const { fetchUser, token } = useAuth()

onMounted(() => {
    if (token.value) {
        fetchUser()
    }
})
</script>

<template>
    <AppHeader />
    <main class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </main>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.app-main
  min-height: calc(100vh - 60px)

.fade-enter-active,
.fade-leave-active
  transition: opacity 250ms ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
</style>
