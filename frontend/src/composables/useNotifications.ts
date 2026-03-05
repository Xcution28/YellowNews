import { ref, readonly } from 'vue'
import type { INotification, TNotificationEvent } from '@/types'

const notifications = ref<INotification[]>([])

function unreadCount() {
    return notifications.value.filter((n) => !n.read).length
}

export function useNotifications() {
    function addNotification(event: TNotificationEvent, message: string, articleId?: string): void {
        const n: INotification = {
            id: `${Date.now()}-${Math.random()}`,
            event,
            message,
            articleId,
            timestamp: new Date(),
            read: false
        }
        notifications.value.unshift(n)

        if (notifications.value.length > 50) {
            notifications.value = notifications.value.slice(0, 50)
        }
    }

    function markAllRead(): void {
        notifications.value.forEach((n) => (n.read = true))
    }

    function markRead(id: string): void {
        const n = notifications.value.find((n) => n.id === id)
        if (n) n.read = true
    }

    function clearAll(): void {
        notifications.value = []
    }

    return {
        notifications: readonly(notifications),
        unreadCount,
        addNotification,
        markAllRead,
        markRead,
        clearAll
    }
}
