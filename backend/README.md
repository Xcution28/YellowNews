# YellowNews — Backend

## Стек технологий

| Технология | Назначение |
|---|---|
| Express | HTTP сервер |
| Mongoose | MongoDB ODM (работа с базой данных) |
| JWT + bcryptjs | Аутентификация и шифрование паролей |
| Socket.IO | Уведомления в реальном времени |
| multer + GridFS | Загрузка и хранение файлов |
| node-cron | Запланированная публикация статей |
| Swagger | Документация API |

---

## Структура проекта

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts         # Подключение к MongoDB
│   │   ├── gridfs.ts     # Инициализация GridFS
│   │   └── swagger.ts    # Конфигурация Swagger
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
│   └── index.ts          # Точка входа для сервера
├── render.yaml           # Конфигурация для деплоя на Render
├── .env.example
├── .gitignore
└── package.json
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

## Swagger Документация

API автоматически документируется через **Swagger UI**: `http://localhost:5000/swagger`
