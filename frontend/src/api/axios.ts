import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
    const token = Cookies.get('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            const url = err.config?.url || ''

            if (!url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
                Cookies.remove('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(err)
    }
)

export default api
