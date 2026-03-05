<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register, isLoading, error } = useAuth()

const form = reactive({ name: '', email: '', password: '' })

async function handleRegister(): Promise<void> {
    await register(form)
    if (!error.value) {
        router.push('/news')
    }
}
</script>
<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-card__logo">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="#FFB020"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="logo-icon"
                >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                <h1>YellowNews</h1>
            </div>
            <h2 class="auth-card__subtitle">Создать аккаунт</h2>

            <form class="auth-form" @submit.prevent="handleRegister">
                <div class="form-group">
                    <label class="form-label">Имя</label>
                    <input
                        v-model="form.name"
                        type="text"
                        class="form-input"
                        placeholder="Человек-паук"
                        required
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input
                        v-model="form.email"
                        type="email"
                        class="form-input"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div class="form-group">
                    <label class="form-label">Пароль</label>
                    <input
                        v-model="form.password"
                        type="password"
                        class="form-input"
                        placeholder="Минимум 8 символов"
                        minlength="8"
                        required
                    />
                </div>

                <p v-if="error" class="alert alert--error">{{ error }}</p>

                <button
                    type="submit"
                    class="btn btn--primary auth-form__submit"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading" class="spinner spinner--md"></span>
                    Зарегистрироваться
                </button>
            </form>

            <p class="auth-card__footer">
                Уже есть аккаунт?
                <router-link to="/login">Войти</router-link>
            </p>
        </div>
    </div>
</template>
