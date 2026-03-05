import { ref, readonly } from 'vue'
import { io, Socket } from 'socket.io-client'
import Cookies from 'js-cookie'
import { useNotifications } from './useNotifications'
import type { TNotificationEvent } from '@/types'

const EVENTS: TNotificationEvent[] = [
    'article:created',
    'article:updated',
    'article:deleted',
    'article:published'
]

const EVENT_MESSAGES: Record<TNotificationEvent, string> = {
    'article:created': 'Статья создана',
    'article:updated': 'Статья обновлена',
    'article:deleted': 'Статья удалена',
    'article:published': 'Статья опубликована'
}

let socket: Socket | null = null
const isConnected = ref(false)

export function useSocket() {
    const { addNotification } = useNotifications()

    function connect(): void {
        if (socket?.connected) return

        const wsUrl = import.meta.env.VITE_WS_URL
        const token = Cookies.get('token')

        socket = io(wsUrl, {
            auth: { token },
            reconnectionAttempts: 5
        })

        socket.on('connect', () => {
            isConnected.value = true
        })

        socket.on('disconnect', () => {
            isConnected.value = false
        })

        EVENTS.forEach((event) => {
            socket!.on(event, (payload: { articleId?: string }) => {
                addNotification(event, EVENT_MESSAGES[event], payload?.articleId)
            })
        })
    }

    function disconnect(): void {
        socket?.disconnect()
        socket = null
        isConnected.value = false
    }

    return {
        isConnected: readonly(isConnected),
        connect,
        disconnect
    }
}
