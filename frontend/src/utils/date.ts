export function formatDate(dateStr: string | Date | null | undefined): string {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('ru', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(dateStr))
}

export function formatDateTime(
    dateStr: string | Date | null | undefined,
    monthFormat: 'short' | 'long' = 'short'
): string {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('ru', {
        year: 'numeric',
        month: monthFormat,
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateStr))
}

export function formatTime(dateStr: string | Date | null | undefined): string {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('ru', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateStr))
}
