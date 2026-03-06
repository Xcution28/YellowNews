# YellowNews — Backend

## Стек технологий

| Технология | Назначение |
|---|---|
| Express | HTTP сервер |
| Mongoose | MongoDB ODM (работа с базой данных) |
| JWT + bcryptjs | Аутентификация и шифрование паролей |
| Socket.IO | Уведомления в реальном времени |
| multer | Загрузка файлов (изображений) |
| node-cron | Запланированная публикация статей |
| Vercel | Бессерверное (serverless) развертывание |

---

## Структура проекта

```
backend/
├── api/
│   └── index.ts          # Точка входа для бессерверной функции Vercel
├── src/
│   ├── config/
│   │   └── db.ts         # Подключение к MongoDB
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── newsController.ts
│   │   └── uploadController.ts
│   ├── middleware/
│   │   ├── auth.ts       # Проверка JWT токенов
│   │   └── error.ts      # Глобальный обработчик ошибок
│   ├── models/
│   │   ├── User.ts
│   │   └── Article.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── news.ts
│   │   └── upload.ts
│   ├── services/
│   │   └── scheduler.ts  # Планировщик публикаций (node-cron)
│   ├── sockets/
│   │   └── notifier.ts   # Отправка событий через Socket.IO
│   ├── utils/
│   │   └── multerConfig.ts
│   └── index.ts          # Локальная точка входа для сервера (dev)
├── uploads/              # Создается автоматически при загрузке файлов
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

## Запуск (Локально)

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
```

Отредактируйте файл `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yellownews
JWT_SECRET=ваш_очень_секретный_ключ
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Запуск в режиме разработчика

```bash
npm run dev
```

Сервер запустится по адресу `http://localhost:5000`.

---

## API Документация

### Авторизация (Auth)

| Метод | Путь | Авторизация | Описание |
|--------|------|------|-------------|
| POST | `/api/auth/register` | – | Создание аккаунта |
| POST | `/api/auth/login` | – | Вход, получение JWT токена |
| GET | `/api/auth/user` | ✅ | Получение данных текущего пользователя |

### Новости (News)

| Метод | Путь | Авторизация | Описание |
|--------|------|------|-------------|
| GET | `/api/news` | ✅ | Получение списка всех статей |
| GET | `/api/news/:id` | ✅ | Получение одной статьи |
| POST | `/api/news` | ✅ | Создание статьи |
| PATCH | `/api/news/:id` | ✅ | Обновление статьи |
| DELETE | `/api/news/:id` | ✅ | Удаление статьи |
| POST | `/api/news/:id/publish` | ✅ | Опубликовать прямо сейчас |
| POST | `/api/news/:id/schedule` | ✅ | Запланировать (`{ publishAt }`) |

### Загрузка файлов (Upload)

| Метод | Путь | Авторизация | Описание |
|--------|------|------|-------------|
| POST | `/api/upload` | ✅ | Загрузка файла (form-data, поле: `file`) |

Загруженные файлы доступны по пути `/uploads/<имя_файла>`.

---

## События в реальном времени (Socket.IO)

Подключитесь к `ws://localhost:5000` и слушайте следующие события:

| Событие | Полезная нагрузка (Payload) |
|-------|---------|
| `article:created` | `{ articleId }` |
| `article:updated` | `{ articleId }` |
| `article:deleted` | `{ articleId }` |
| `article:published` | `{ articleId }` |

---

## Развертывание (Vercel)

> ⚠️ Socket.IO **не** поддерживается в бессерверных (serverless) функциях Vercel.
> Для полноценной поддержки WebSocket используйте постоянный хостинг (Railway, Render, Fly.io).

### Шаги

```bash
# Глобальная установка Vercel CLI
npm i -g vercel

# Находясь в папке backend/
vercel

# Следуйте подсказкам и затем добавьте переменные окружения:
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add CLIENT_ORIGIN

# Развертывание в production
vercel --prod
```

### В файле `.env` фронтенда (после развертывания бэкенда)

```
VITE_API_BASE_URL=https://ваш-backend.vercel.app
VITE_WS_URL=https://ваш-backend.vercel.app
```
