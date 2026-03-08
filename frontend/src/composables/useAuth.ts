import { ref, readonly, computed } from 'vue'
import { authApi } from '@/api/auth'
import Cookies from 'js-cookie'
import type { IUser, IAuthCredentials, IRegisterPayload } from '@/types'

const user = ref<IUser | null>(null)
const token = ref<string | null>(Cookies.get('token') || null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value)

    async function login(credentials: IAuthCredentials): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const { data } = await authApi.login(credentials)
            token.value = data.token
            user.value = data.user
            Cookies.set('token', data.token, { expires: 7 })
        } catch (e: unknown) {
            error.value =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Ошибка авторизации'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    async function register(payload: IRegisterPayload): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const { data } = await authApi.register(payload)
            token.value = data.token
            user.value = data.user
            Cookies.set('token', data.token, { expires: 7 })
        } catch (e: unknown) {
            error.value =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Ошибка регистрации'
            throw e
        } finally {
            isLoading.value = false
        }
    }

    function logout(): void {
        token.value = null
        user.value = null
        Cookies.remove('token')
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return
        isLoading.value = true
        try {
            const { data } = await authApi.user()
            user.value = data
        } catch {
            logout()
        } finally {
            isLoading.value = false
        }
    }

    return {
        user: readonly(user),
        token: readonly(token),
        isLoading: readonly(isLoading),
        error: readonly(error),
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser
    }
}
