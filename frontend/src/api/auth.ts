import api from './axios'
import type { IAuthCredentials, IRegisterPayload, IAuthResponse, IUser } from '@/types'

export const authApi = {
    register: (payload: IRegisterPayload) => api.post<IAuthResponse>('/api/auth/register', payload),

    login: (payload: IAuthCredentials) => api.post<IAuthResponse>('/api/auth/login', payload),

    user: () => api.get<IUser>('/api/auth/user')
}
