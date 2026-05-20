# API Reference — GigFlow

Base path: `http://localhost:5000/api`

Authentication

- POST `/auth/register` — register a user. Body: `{ name, email, password, role? }` (role defaults to `sales_user`)
- POST `/auth/login` — login. Body: `{ email, password }`. Returns access token and sets refresh token cookie.
- POST `/auth/refresh` — refresh access token using refresh cookie.
- POST `/auth/logout` — clears refresh token cookie.
- GET `/auth/me` — returns current user (requires Authorization header `Bearer <token>`).

Leads

- GET `/leads` — list leads. Query params: `status`, `source`, `search`, `sort`, `page`, `limit`.
- GET `/leads/:id` — get a single lead by id.
- POST `/leads` — create lead. Body: `{ name, email, status, source }`.
- PUT `/leads/:id` — update lead.
- PATCH `/leads/:id/status` — update only status. Body: `{ status }`.
- DELETE `/leads/:id` — delete lead (requires `admin` role).

Export

- GET `/export/leads/csv` — download CSV of leads with the same query params available to `GET /leads`.

Users (admin-only)

- GET `/users` — list users (admin)
- POST `/users` — create user (admin). Body: `{ name, email, password, role? }`
- PATCH `/users/:id/role` — change user's role (admin)
- DELETE `/users/:id` — delete a user (admin)

Authentication notes

- Use `Authorization: Bearer <access_token>` for protected endpoints.
- Refresh tokens are rotated and stored in an HttpOnly cookie; call `/auth/refresh` to obtain a new access token.

Example: login + fetch user

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpass"}' \
  -c cookies.txt

# use returned access token for requests
```
