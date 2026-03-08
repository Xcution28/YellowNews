# YellowNews

Фуллстек-приложение для публикации и управления новостями.

Стэк **Vue 3** + **Node.js + Express**

## Ссылки на рабочий проект (Production)

- **Фронтенд:** [https://yellow-news-sigma.vercel.app](https://yellow-news-sigma.vercel.app)
- **Бэкенд API:** [https://yellownews-backend.onrender.com](https://yellownews-backend.onrender.com)
- **Документация Swagger:** [https://yellownews-backend.onrender.com/swagger](https://yellownews-backend.onrender.com/swagger)

---

## Архитектура и Деплой

Проект настроен для полностью автоматического развертывания (CI/CD):

*   **Фронтенд (`frontend/`)**
    *   Разворачивается на **Vercel**.
    *   Работает как SPA (Single Page Application).
    *   Адаптив под разные разрешения экрана.

*   **Бэкенд (`backend/`)**
    *   Разворачивается на **Render.com** (Web Service).
    *   Сборка описана через Infrastructure as Code конфигурацию в файле `render.yaml`.
    *   Файлы загружаются в базу данных MongoDB (**GridFS**).
    *   Запущен Socket.IO для реал-тайм уведомлений.

*   **База данных (MongoDB Atlas)**
    *   Облачный кластер MongoDB.
    *   Содержит коллекции для новостей, пользователей и файловое хранилище GridFS (коллекция `uploads.files` и `uploads.chunks`).

---

## Особенности и нюансы работы

1.  **Загрузка файлов (GridFS)**
    *   Локальная загрузка на диск в папку `uploads/` **отключена** для продакшена.
    *   Все файлы (картинки, документы) прилетают из фронтенда на `POST /api/upload`, хранятся в оперативной памяти бэкенда через `multer.memoryStorage()`, а затем стримятся напрямую в MongoDB Atlas через GridFS.
    *   При запросе файла бэкенд возвращает относительный путь вида `/api/upload/:id`.

2.  **CORS и Безопасность**
    *   Бэкенд настроен так, чтобы принимать запросы только с разрешенного домена фронтенда.
    *   В панели Render (`Environment Variables`) переменная `CLIENT_ORIGIN` должна быть установлена на домен фронтенда: `https://yellow-news-sigma.vercel.app`.
