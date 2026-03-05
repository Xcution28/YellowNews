import api from './axios'
import type { IUploadResponse } from '@/types'

export const uploadApi = {
    upload: (file: File) => {
        const form = new FormData()
        form.append('file', file)
        return api.post<IUploadResponse>('/api/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}
