# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

## Tech Stack

**Frontend:** React 18 · TypeScript · Vite · TailwindCSS · Zustand · React Query · React Hook Form · Zod

**Backend:** Node.js · Express.js · TypeScript · MongoDB · Mongoose · JWT · bcrypt · Zod

**Infrastructure:** Docker · Docker Compose

## Features

- JWT authentication with refresh token rotation
- Role-based access control (Admin / Sales User)
- Full lead CRUD with status and source management
- Advanced filtering — status, source, search, sort (combinable)
- Debounced search (400ms)
- Backend pagination (10 per page)
- CSV export with active filters applied
- Dark mode (persisted to localStorage)
- Responsive design

## Quick Start

### Prerequisites
- Docker Desktop (running)
- Node.js 20+ (for local dev without Docker)

### With Docker (recommended)

```bash
git clone <your-repo-url>
cd gigflow

# Copy env file and fill in your values
cp .env.example server/.env

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Without Docker

```bash
# Terminal 1 — Backend
cd server
cp ../.env.example .env   # edit MONGO_URI to point to your local MongoDB
npm install
npm run dev

# Terminal 2 — Frontend
cd client
npm install
npm run dev
```

## Default Admin Account

Register at `/register` and select role **Admin**, or use the account you created during setup.

## API Documentation

### Auth — `/api/auth`

| Method | Endpoint    | Auth | Body                              |
|--------|-------------|------|-----------------------------------|
| POST   | /register   | —    | name, email, password, role?      |
| POST   | /login      | —    | email, password                   |
| POST   | /refresh    | cookie | —                               |
| POST   | /logout     | ✓    | —                                 |
| GET    | /me         | ✓    | —                                 |

### Leads — `/api/leads`

| Method | Endpoint        | Auth  | Notes                          |
|--------|-----------------|-------|--------------------------------|
| GET    | /               | ✓     | ?status=&source=&search=&sort=&page=&limit= |
| GET    | /:id            | ✓     |                                |
| POST   | /               | ✓     | name, email, status, source    |
| PUT    | /:id            | ✓     | partial update                 |
| PATCH  | /:id/status     | ✓     | { status }                     |
| DELETE | /:id            | admin |                                |

### Export — `/api/export`

| Method | Endpoint    | Auth | Notes                        |
|--------|-------------|------|------------------------------|
| GET    | /leads/csv  | ✓    | same query params as GET /leads |

### Users — `/api/users`

| Method | Endpoint    | Auth  | Notes              |
|--------|-------------|-------|--------------------|
| GET    | /           | admin |                    |
| PATCH  | /:id/role   | admin | { role }           |
| DELETE | /:id        | admin |                    |

## Environment Variables

See `.env.example` for all required variables.

| Variable             | Description                        |
|----------------------|------------------------------------|
| MONGO_URI            | MongoDB connection string          |
| JWT_SECRET           | Access token secret (32+ chars)    |
| JWT_REFRESH_SECRET   | Refresh token secret (32+ chars)   |
| JWT_ACCESS_EXPIRES   | Access token TTL (e.g. 15m)        |
| JWT_REFRESH_EXPIRES  | Refresh token TTL (e.g. 7d)        |
| CLIENT_URL           | Frontend URL for CORS              |

## Project Structure

```
gigflow/
├── docker-compose.yml
├── .gitignore 
├── README.md
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # ui/, layout/, leads/, filters/
│   │   ├── pages/             # LoginPage, DashboardPage, etc.
│   │   ├── hooks/             # useLeads, useDebounce
│   │   ├── services/          # api.ts, auth.service.ts, leads.service.ts
│   │   ├── store/             # authStore, uiStore (Zustand)
│   │   └── types/             # shared TypeScript interfaces
│   └── Dockerfile
└── server/                    # Express backend
    ├── src/
    │   ├── config/            # db.ts, env.ts
    │   ├── models/            # User, Lead, RefreshToken
    │   ├── routes/            # auth, leads, users, export
    │   ├── controllers/       # thin request handlers
    │   ├── services/          # business logic
    │   ├── middleware/        # requireAuth, requireRole, errorHandler
    │   ├── validators/        # Zod schemas
    │   └── utils/             # AppError, asyncHandler
    └── Dockerfile
```