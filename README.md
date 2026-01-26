# Task Management Backend API

A robust backend API for task management application built with Node.js, Express, and MySQL. Features real-time notifications, deadline reminders, push notifications, and email support.

## 🚀 Features

- **User Authentication**: Secure login, logout, token refresh with JWT
- **Task Management**: Full CRUD operations for tasks with categories/tabs
- **Task Tabs**: Organize tasks into customizable tabs/categories
- **Real-time Notifications**: Socket.io for live updates
- **Deadline Reminders**: Automated cron job checks for upcoming deadlines
- **Push Notifications**: Firebase Cloud Messaging integration
- **Email Notifications**: Nodemailer for OTP and alerts
- **Caching**: Redis for improved performance
- **Email Support**: OTP and notification emails via Nodemailer
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Joi schema validation
- **Error Handling**: Custom exception handling middleware

## 📋 Table of Contents

- [Task Management Backend API](#task-management-backend-api)
  - [🚀 Features](#-features)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔧 Prerequisites](#-prerequisites)
  - [🛠 Tech Stack](#-tech-stack)
  - [📁 Project Structure](#-project-structure)
  - [📦 Installation](#-installation)
  - [🔐 Environment Variables](#-environment-variables)
  - [🗃 Database Migrations](#-database-migrations)
    - [Database Schema](#database-schema)
  - [🚀 Running the Server](#-running-the-server)
  - [📡 API Endpoints](#-api-endpoints)
    - [Authentication](#authentication)
      - [Login Request](#login-request)
      - [Response](#response)
    - [Users](#users)
    - [Tasks](#tasks)
      - [Create Task Request](#create-task-request)
    - [Task Tabs](#task-tabs)
    - [Notifications](#notifications)
  - [🔌 Socket.io Events](#-socketio-events)
    - [Client → Server](#client--server)
    - [Server → Client](#server--client)
  - [⏰ Cron Jobs](#-cron-jobs)
    - [Deadline Reminder](#deadline-reminder)
  - [📜 Available Scripts](#-available-scripts)
  - [🧪 Testing](#-testing)
    - [Test Structure](#test-structure)
    - [Running Tests](#running-tests)
    - [Test Environment](#test-environment)
  - [🔒 Security Features](#-security-features)
  - [📊 Error Handling](#-error-handling)
  - [🚧 Error Responses](#-error-responses)
  - [📈 Performance](#-performance)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🆘 Support](#-support)

## 🔧 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Redis Server
- Firebase Admin Account (for push notifications)

## 🛠 Tech Stack

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| Node.js        | Runtime environment        |
| Express.js     | Web framework              |
| MySQL2         | Database driver            |
| Socket.io      | Real-time communication    |
| JWT            | Token-based authentication |
| Redis          | Caching layer              |
| Firebase Admin | Push notifications         |
| Nodemailer     | Email service              |
| Joi            | Data validation            |
| Bcrypt         | Password hashing           |

## 📁 Project Structure

```
task-management-be/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   └── firebase.js          # Firebase Admin setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── tasksController.js   # Task operations
│   │   ├── taskTabsController.js # Tab operations
│   │   ├── usersController.js   # User operations
│   │   └── notificationsController.js
│   ├── exceptions/              # Custom error classes
│   ├── middlewares/
│   │   ├── authHandler.js       # JWT verification
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── validate.js          # Joi validation
│   │   └── ...                  # Other middleware
│   ├── models/
│   │   ├── Task/                # Task database operations
│   │   ├── Tab/                 # Tab database operations
│   │   ├── User/                # User database operations
│   │   └── Notifications/       # Notification operations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tasksRoutes.js
│   │   ├── taskTabsRoutes.js
│   │   ├── usersRoutes.js
│   │   └── notificationsRoutes.js
│   ├── services/
│   │   ├── cron/cronDeadline.js # Deadline reminder cron
│   │   ├── firebase/fcmService.js
│   │   ├── mail/index.js        # Email service
│   │   ├── rabbitmq/ProducerService.js
│   │   └── redis/CacheService.js
│   ├── utils/
│   │   ├── tokenize/TokenManager.js
│   │   └── index.js
│   ├── validator/               # Joi schemas
│   ├── server.js                # Main entry point
│   └── socket.js                # Socket.io setup
├── migrations/                  # Database migrations
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd task-management-be
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. **Set up the database**

    ```bash
    # Create MySQL database
    mysql -u root -p -e "CREATE DATABASE task_management;"

    # Run migrations
    npm run migrate:up
    ```

5. **Start Redis server** (required for caching)

    ```bash
    redis-server
    ```

6. **Start the development server**
    ```bash
    npm run start:dev
    ```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

| Variable              | Description              | Required                |
| --------------------- | ------------------------ | ----------------------- |
| `PORT`                | Server port              | No (default: 3001)      |
| `HOST`                | Server host              | No (default: undefined) |
| `DB_HOST`             | MySQL host               | Yes                     |
| `DB_USER`             | MySQL username           | Yes                     |
| `DB_PASSWORD`         | MySQL password           | Yes                     |
| `DB_DATABASE`         | MySQL database name      | Yes                     |
| `JWT_ACCESS_SECRET`   | JWT access token secret  | Yes                     |
| `JWT_REFRESH_SECRET`  | JWT refresh token secret | Yes                     |
| `REDIS_SERVER`        | Redis server host        | Yes                     |
| `CORS_ORIGIN`         | Allowed CORS origin      | Yes                     |
| `MAIL_SERVICE`        | Email service provider   | No                      |
| `MAIL_USER`           | Email address            | No                      |
| `MAIL_PASSWORD`       | Email password/app token | No                      |
| `FIREBASE_PROJECT_ID` | Firebase project ID      | No                      |

## 🗃 Database Migrations

Available migration commands:

```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Rollback all migrations
npm run migrate:downAll
```

### Database Schema

The application uses the following tables:

- `users` - User accounts
- `authentications` - Refresh tokens
- `task_tabs` - Task categories/tabs
- `tasks` - Task items
- `notifications` - User notifications

## 🚀 Running the Server

```bash
# Development mode (with nodemon)
npm run start:dev

# Production mode
npm start

# Run with custom port
PORT=8080 npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| POST   | `/api/auth/login`   | User login           | No            |
| GET    | `/api/auth/refresh` | Refresh access token | No            |
| DELETE | `/api/auth/logout`  | User logout          | Yes           |
| GET    | `/api/auth/me`      | Get current user     | Yes           |

#### Login Request

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "your-password"
}
```

#### Response

```json
{
    "status": "success",
    "message": "Login berhasil",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

### Users

| Method | Endpoint         | Description    | Auth Required |
| ------ | ---------------- | -------------- | ------------- |
| GET    | `/api/users`     | Get all users  | Yes           |
| GET    | `/api/users/:id` | Get user by ID | Yes           |
| PUT    | `/api/users/:id` | Update user    | Yes           |
| DELETE | `/api/users/:id` | Delete user    | Yes           |

### Tasks

| Method | Endpoint         | Description                     | Auth Required |
| ------ | ---------------- | ------------------------------- | ------------- |
| GET    | `/api/tasks`     | Get all tasks (filter by tabId) | Yes           |
| POST   | `/api/tasks`     | Create new task                 | Yes           |
| GET    | `/api/tasks/:id` | Get task by ID                  | Yes           |
| PUT    | `/api/tasks/:id` | Update task                     | Yes           |
| PATCH  | `/api/tasks/:id` | Partial update task             | Yes           |
| DELETE | `/api/tasks/:id` | Delete task                     | Yes           |

#### Create Task Request

```json
POST /api/tasks
{
  "title": "Complete project",
  "detail": "Finish all features",
  "deadline": "2024-12-31T23:59:00Z",
  "hasDate": true,
  "hasTime": true,
  "starred": false,
  "isCompleted": false,
  "taskTabId": "tab-xxx"
}
```

### Task Tabs

| Method | Endpoint             | Description    | Auth Required |
| ------ | -------------------- | -------------- | ------------- |
| GET    | `/api/task-tabs`     | Get all tabs   | Yes           |
| POST   | `/api/task-tabs`     | Create new tab | Yes           |
| PUT    | `/api/task-tabs/:id` | Update tab     | Yes           |
| DELETE | `/api/task-tabs/:id` | Delete tab     | Yes           |

### Notifications

| Method | Endpoint                 | Description            | Auth Required |
| ------ | ------------------------ | ---------------------- | ------------- |
| GET    | `/api/notifications`     | Get user notifications | Yes           |
| POST   | `/api/notifications`     | Create notification    | Yes           |
| DELETE | `/api/notifications/:id` | Delete notification    | Yes           |

## 🔌 Socket.io Events

### Client → Server

| Event       | Payload  | Description                   |
| ----------- | -------- | ----------------------------- |
| `join-user` | `userId` | Join user's notification room |

### Server → Client

| Event               | Payload               | Description                    |
| ------------------- | --------------------- | ------------------------------ |
| `deadline-reminder` | `{ title, deadline }` | Deadline reminder notification |

**Example Usage:**

```javascript
const socket = io('http://localhost:3001');

// Join user room for notifications
socket.emit('join-user', 'user-123');

// Listen for deadline reminders
socket.on('deadline-reminder', (data) => {
    console.log('Deadline approaching:', data);
});
```

## ⏰ Cron Jobs

### Deadline Reminder

- **Schedule**: Every minute (`* * * * *`)
- **Timezone**: Asia/Jakarta
- **Function**: Checks for tasks with approaching deadlines and sends:
    - Real-time Socket.io notifications
    - Firebase push notifications
    - Email notifications (if configured)

## 📜 Available Scripts

| Script            | Command                   | Description              |
| ----------------- | ------------------------- | ------------------------ |
| `start`           | `node src/server.js`      | Start production server  |
| `start:dev`       | `nodemon src/server.js`   | Start development server |
| `lint`            | `eslint ./src`            | Run ESLint               |
| `migrate:up`      | `node migrate.js up`      | Run database migrations  |
| `migrate:down`    | `node migrate.js down`    | Rollback last migration  |
| `migrate:downAll` | `node migrate.js downAll` | Rollback all migrations  |

## 🧪 Testing

The project includes comprehensive unit and integration tests using Jest. Tests cover controllers, middlewares, utilities, validators, and API routes.

### Test Structure

```
src/__test__/
├── setup.js                    # Jest global setup
├── controllers/
│   ├── authController.test.js  # Authentication controller tests
│   ├── tasksController.test.js # Task controller tests
│   └── taskTabsController.test.js # Task tabs controller tests
├── middlewares/
│   └── validate.test.js        # Validation middleware tests
└── validator/
    └── authSchema.test.js      # Joi schema validation tests
```

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Environment

Tests use:

- **Jest**: Testing framework
- **Supertest**: HTTP endpoint testing
- **Jest-mock-extended**: Advanced mocking capabilities
- **In-memory mocks**: Database and external service mocking


## 🔒 Security Features

- **Rate Limiting**: 100 requests per 5 minutes per IP
- **Login Rate Limiting**: 5 login attempts per 5 minutes
- **JWT Tokens**: Short-lived access tokens with refresh token rotation
- **HTTP-only Cookies**: Secure cookie handling for refresh tokens
- **CORS**: Configured allowed origins
- **Input Validation**: All inputs validated with Joi schemas

## 📊 Error Handling

The API uses custom error classes:

- `InvariantError` - Bad request errors
- `NotFoundError` - Resource not found
- `AuthenticationError` - Authentication failures
- `AuthorizationError` - Permission denied
- `ClientError` - Client-side errors
- `MethodError` - Method not allowed

All errors are handled by the global error handler middleware.

## 🚧 Error Responses

```json
{
    "status": "fail",
    "message": "Error description"
}
```

## 📈 Performance

- **Redis Caching**: Reduces database load for frequently accessed data
- **Connection Pooling**: MySQL connection pool for efficient DB access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the repository or contact the maintainers.

---

**Built with ❤️ for efficient task management**
