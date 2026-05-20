 # GigFlow — Lead Management Dashboard

![React](https://img.shields.io/badge/React-17+-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue?logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green?logo=mongodb&logoColor=white)

GigFlow is a full-stack lead management dashboard (React + TypeScript frontend, Node + Express backend, MongoDB) focused on fast lead workflows, role-based access, and CSV exports.

## Table of contents
- Project overview
- Quick setup
- Development
- Environment
- API documentation
- Project structure
- Contributing

## Project overview

- Frontend: React, Vite, TypeScript, TailwindCSS
- Backend: Node, Express, TypeScript, MongoDB, Mongoose
- Auth: JWT with refresh rotation
- RBAC: `admin` and `sales_user` roles

## Features

- JWT Authentication
- Role-based access control
- Lead filtering & search
- CSV export
- Admin user management
- Refresh token rotation

See the docs folder for additional policies and API reference: [docs/README.md](docs/README.md)

## Quick setup

Prerequisites: Node 18+, npm or yarn, Docker (optional), MongoDB (local or remote)

Recommended: run everything with Docker Compose (local development):

```bash
git clone <your-repo-url>
cd gigflow

# Copy the example env and update values
copy .env.example server\.env

docker compose up --build
```

When running locally without Docker, start the backend and frontend in separate terminals:

```bash
# Backend
cd server
npm install
copy ..\.env.example .env   # edit MONGO_URI and secrets
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:5000

## Development

- Backend: `cd server` → `npm run dev` (uses `ts-node-dev`)
- Frontend: `cd client` → `npm run dev` (Vite)

## Environment (.env)

Create a `.env` for the server (see `.env.example`). Important variables used by the project:

- `NODE_ENV` — node environment (development / production)
- `PORT` — backend port (default 5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — access token secret (min 32 chars)
- `JWT_REFRESH_SECRET` — refresh token secret (min 32 chars)
- `JWT_ACCESS_EXPIRES` — e.g. `15m`
- `JWT_REFRESH_EXPIRES` — e.g. `7d`
- `CLIENT_URL` — frontend origin for CORS

Full example: see `.env.example` at the project root.

## API Documentation

See [docs/API.md](docs/API.md) for a concise endpoint reference, authentication flow, and example requests.

## Project structure

```
gigflow/
├── docker-compose.yml
├── README.md
├── .env.example
├── client/        # React frontend (Vite + TypeScript)
└── server/        # Express API (TypeScript)
```

## Docs and policies

Documentation and policies are in the `docs/` folder. See [docs/README.md](docs/README.md).

## Contributing

- Fork the repository and open a PR
- Keep changes small and focused
- Run linting and tests before submitting

If you'd like, I can also commit these documentation files for you.