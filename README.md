# GigFlow — Smart Leads Dashboard

A full-stack lead management dashboard built with the MERN stack and TypeScript.
- Frontend: https://smart-leads-dashboard-ten-green.vercel.app
- Backend API:https://smart-leads-dashboard-1-ovz6.onrender.com/api/health

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| State | Zustand (client state), React Query (server state) |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB 7, Mongoose ODM |
| Auth | JWT access token + refresh token via httpOnly cookie |
| Validation | Zod — frontend and backend |
| Container | Docker + Docker Compose |

---

## Features

- JWT authentication with silent refresh token rotation
- Role-based access control — Admin and Sales User
- Lead CRUD with status tracking — New, Contacted, Qualified, Closed
- Advanced filtering — status, source, search, sort — all combinable
- Debounced search — 400ms delay, single API call per query
- Backend pagination — 10 records per page with full metadata
- CSV export with active filters applied
- Admin panel — user management and role assignment
- Rate limiting on login — 10 attempts per 15 minutes


---

## Quick Start

### With Docker (recommended)

```bash
git clone https://github.com/chhatraraj/smart-leads-dashboard.git
cd gigflow

# Windows
copy .env.example server\.env

# Mac / Linux
cp .env.example server/.env

# Fill in your MONGO_URI and JWT secrets in server/.env, then:
docker compose up --build
```

- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- Health check → http://localhost:5000/api/health

### Without Docker

```bash
# Terminal 1 — Backend
cd server
cp ../.env.example .env
npm install
npm run dev

# Terminal 2 — Frontend
cd client
npm install
npm run dev
```

---

## API Reference

Full request/response examples → [`docs/API.md`](docs/API.md)

Postman collection → [`docs/gigflow.postman_collection.json`](docs/gigflow.postman_collection.json)

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register new user, returns access token |
| POST | `/login` | — | Login, returns access token + sets refresh cookie |
| POST | `/refresh` | cookie | Issue new access token from refresh cookie |
| POST | `/logout` | ✓ | Revoke refresh token, clear cookie |
| GET | `/me` | ✓ | Return current authenticated user |

### Leads — `/api/leads`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✓ | Paginated lead list with filters |
| GET | `/:id` | ✓ | Single lead detail |
| POST | `/` | ✓ | Create new lead |
| PATCH | `/:id` | ✓ | Update lead fields |
| DELETE | `/:id` | admin | Soft delete lead |

**Query parameters for GET `/`:**
```
?page=1&limit=10&status=new&source=Instagram&search=rahul&sort=latest
```
All parameters are optional and combinable.

### Export — `/api/export`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leads/csv` | ✓ | Download filtered leads as CSV |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | admin | List all users with pagination |
| PATCH | `/:id/role` | admin | Change a user's role |
| DELETE | `/:id` | admin | Delete a user account |

---

## Role Permissions

| Action | Admin | Sales User |
|---|---|---|
| View all leads | ✓ | — |
| View own leads | ✓ | ✓ |
| Create lead | ✓ | ✓ |
| Update own lead | ✓ | ✓ |
| Update any lead | ✓ | — |
| Delete lead | ✓ | — |
| Export CSV | ✓ | ✓ (own leads only) |
| Manage users | ✓ | — |

Role is assigned by an existing admin — users cannot self-assign roles at registration.

---

## Database Choice — MongoDB

This project uses MongoDB with Mongoose ODM.

**Why MongoDB over PostgreSQL:**

- **Schema flexibility** — optional fields (phone, company, notes) work naturally without nullable column overhead
- **Document model** — a lead is a self-contained document with no joins needed across tables
- **No migrations** — adding new fields requires no `ALTER TABLE` — just update the schema
- **Mongoose hooks** — pre-save middleware handles bcrypt hashing cleanly at the model level

**When PostgreSQL would be the better choice:**
- Complex relational data requiring many joins
- Strict ACID transactions across multiple tables
- Heavy reporting and aggregations using SQL

---

