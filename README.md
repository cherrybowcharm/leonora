# Leonora — Task Management App

A full-stack MERN task management application with JWT authentication, user-specific task isolation, search, filter, and pagination.

---

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected dashboard route (token required)
- Create, view, edit, and delete tasks
- Toggle task status between pending and completed
- User-specific task isolation (users only see their own tasks)
- Search tasks by title or description
- Filter tasks by status (all / pending / completed)
- Pagination with configurable page size
- Clean validation and error handling
- Responsive, glassmorphism UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Styling | Custom CSS (glassmorphism) |

---

## Project Structure

```
leonora/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Register, login, getMe
│   │   └── task.controller.js    # Full CRUD + toggle + search/filter/pagination
│   ├── middleware/
│   │   ├── auth.js               # JWT protect middleware
│   │   └── errorHandler.js       # Centralized error handler + AppError class
│   ├── models/
│   │   ├── User.js               # User schema (password hashed pre-save)
│   │   └── Task.js               # Task schema with userId reference + indexes
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── task.validator.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/                     # (coming next)
```

---

## Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Navigate to the backend folder

```bash
cd leonora/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leonora?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Run the backend

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server starts at `http://localhost:5000`

---

## API Routes

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive JWT |
| GET | `/api/auth/me` | Protected | Get current user |

### Task Routes — `/api/tasks`

All task routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Protected | Get tasks (search, filter, pagination) |
| POST | `/api/tasks` | Protected | Create a new task |
| GET | `/api/tasks/:id` | Protected | Get a single task |
| PUT | `/api/tasks/:id` | Protected | Update a task |
| DELETE | `/api/tasks/:id` | Protected | Delete a task |
| PATCH | `/api/tasks/:id/toggle` | Protected | Toggle task status |

---

## Example Request Bodies

### Register
```json
POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

### Create Task
```json
POST /api/tasks
Authorization: Bearer <token>
{
  "title": "Design landing page",
  "description": "Create the hero section and feature cards"
}
```

### Update Task
```json
PUT /api/tasks/:id
Authorization: Bearer <token>
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

---

## Query Parameters — GET /api/tasks

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Search in title and description |
| `status` | string | — | Filter by `pending` or `completed` |
| `page` | number | 1 | Page number |
| `limit` | number | 6 | Tasks per page (max 50) |

**Examples:**
```
GET /api/tasks
GET /api/tasks?search=design
GET /api/tasks?status=pending
GET /api/tasks?status=completed&page=2&limit=6
GET /api/tasks?search=frontend&status=pending&page=1&limit=6
```

**Response:**
```json
{
  "success": true,
  "tasks": [...],
  "pagination": {
    "totalTasks": 18,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 6,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Deployment

### Backend — Render

1. Push the `backend/` folder to a GitHub repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add environment variables in Render's dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL` (your Vercel frontend URL)
   - `NODE_ENV=production`

### Frontend — Vercel *(coming next)*

1. Push the `frontend/` folder to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL

---

## Screenshots / Demo

*Screenshots will be added after the frontend is complete.*

---

## Security Notes

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire in 7 days by default (configurable via `JWT_EXPIRES_IN`)
- `password` field is excluded from all database queries using Mongoose `select: false`
- Task ownership is enforced at the database query level — users can only access their own tasks
- Request body size is limited to 10kb to prevent payload attacks
- Error messages in production never expose stack traces
