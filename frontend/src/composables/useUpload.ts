import { uploadApi } from '@/api/upload'
import type { IUploadResponse } from '@/types'

export function useUpload() {
    async function uploadFile(file: File): Promise<IUploadResponse | null> {
        try {
            const { data } = await uploadApi.upload(file)
            if (data && data.url && data.url.startsWith('/')) {
                const baseUrl = import.meta.env.VITE_API_BASE_URL
                data.url = baseUrl.replace(/\/$/, '') + data.url
            }
            return data
        } catch {
            return null
        }
    }

    return { uploadFile }
}
