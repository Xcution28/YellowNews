import { uploadApi } from '@/api/upload'
import type { IUploadResponse } from '@/types'

export function useUpload() {
    async function uploadFile(file: File): Promise<IUploadResponse | null> {
        try {
            const { data } = await uploadApi.upload(file)
            return data
        } catch {
            return null
        }
    }

    return { uploadFile }
}
