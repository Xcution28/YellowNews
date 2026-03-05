import type { IArticle, IUser } from '@/types'

export const mockUser: IUser = {
    id: 'usr_1',
    name: 'Человек-паук',
    email: 'spiderman@example.com'
}

export const mockArticles: IArticle[] = [
    {
        id: 'art_1',
        title: 'Лучшие практики Composition API во Vue 3',
        content:
            '<p>Composition API — отличный способ переиспользования логики в приложениях на Vue.</p><pre><code class="language-javascript">const count = ref(0)</code></pre>',
        status: 'published',
        author: mockUser,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        publishAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 'art_2',
        title: 'Почему Vite быстрее, чем Webpack',
        content:
            '<p>Vite использует нативные ESM модули во время разработки, что позволяет избежать сборки всего проекта до выхода в продакшен.</p><blockquote><p>Vite очень быстрый. Невероятно быстрый.</p></blockquote>',
        status: 'draft',
        author: mockUser,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        publishAt: null
    },
    {
        id: 'art_3',
        title: 'Грядущие нововведения в Node.js 22',
        content:
            '<h2>Нативные WebSockets</h2><p>Node.js наконец-то получает нативную реализацию websocket.</p>',
        status: 'scheduled',
        author: mockUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishAt: new Date(Date.now() + 86400000 * 3).toISOString()
    }
]
