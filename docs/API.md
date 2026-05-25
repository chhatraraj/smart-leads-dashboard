# API Reference — GigFlow

Base URL: `http://localhost:5000/api`

For full request examples, import `docs/gigflow.postman_collection.json` into Postman.

---

## Authentication

All protected routes require:
```
Authorization: Bearer <access_token>
```

Access tokens expire in **15 minutes**. Use `POST /auth/refresh` to silently obtain a new one via the httpOnly refresh cookie (7 day expiry).

### Endpoints

**POST `/auth/register`**
```json
// body
{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "Secret1234" }

// response 201
{ "success": true, "data": { "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales_user" }, "accessToken": "eyJ..." } }
```
> Role is always `sales_user` on registration. Only an existing admin can promote a user.

---

**POST `/auth/login`**
```json
// body
{ "email": "rahul@example.com", "password": "Secret1234" }

// response 200
{ "success": true, "data": { "user": { ... }, "accessToken": "eyJ..." } }
```
> Refresh token is set as an httpOnly cookie automatically.
> Rate limited — 10 attempts per 15 minutes per IP.

---

**POST `/auth/refresh`**
```json
// no body — uses httpOnly cookie

// response 200
{ "success": true, "data": { "accessToken": "eyJ..." } }
```

---

**POST `/auth/logout`**
```json
// no body

// response 200
{ "success": true, "message": "Logged out successfully" }
```
> Revokes refresh token in DB and clears cookie.

---

**GET `/auth/me`** — requires auth
```json
// response 200
{ "success": true, "data": { "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales_user" } } }
```

---

## Leads

All lead endpoints require authentication.
Admin sees all leads. Sales user sees only leads they created.

### Lead fields

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | ✓ | min 2 chars |
| email | string | ✓ | valid email format |
| phone | string | — | optional |
| company | string | — | optional |
| notes | string | — | optional |
| status | enum | — | `new` `contacted` `qualified` `closed` — defaults to `new` |
| source | enum | ✓ | `Website` `Instagram` `Referral` |

---

**GET `/leads`** — requires auth
```
Query params (all optional, all combinable):

page    → page number (default: 1)
limit   → records per page (default: 10, max: 100)
status  → new | contacted | qualified | closed
source  → Website | Instagram | Referral
search  → searches name and email (case-insensitive)
sort    → latest (default) | oldest
```

```json
// example
GET /leads?status=qualified&source=Instagram&search=rahul&page=1&sort=latest

// response 200
{
  "success": true,
  "leads": [ { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "status": "qualified", "source": "Instagram", "createdBy": { "name": "Admin", "email": "admin@gigflow.com" }, "createdAt": "2026-05-18T..." } ],
  "meta": { "total": 25, "page": 1, "limit": 10, "pages": 3 }
}
```

---

**GET `/leads/:id`** — requires auth
```json
// response 200
{ "success": true, "data": { "_id": "...", "name": "Rahul Sharma", ... } }

// response 404
{ "success": false, "message": "Lead not found" }
```

---

**POST `/leads`** — requires auth
```json
// body
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+977-9800000000",
  "company": "TechCorp",
  "notes": "Interested in enterprise plan",
  "source": "Instagram",
  "status": "new"
}

// response 201
{ "success": true, "data": { "_id": "...", "name": "Rahul Sharma", ... } }
```

---

**PATCH `/leads/:id`** — requires auth (admin: any lead, sales_user: own leads only)
```json
// body — all fields optional
{
  "status": "contacted",
  "notes": "Called on May 25, very interested"
}

// response 200
{ "success": true, "data": { "_id": "...", "status": "contacted", ... } }
```

---

**DELETE `/leads/:id`** — admin only
```json
// response 200
{ "success": true, "message": "Lead deleted" }

// response 403 (non-admin)
{ "success": false, "message": "Role 'sales_user' is not allowed to perform this action" }
```
> Soft delete — sets `isDeleted: true`. Data is preserved in the database.

---

## Export

**GET `/export/leads/csv`** — requires auth

Accepts the same query params as `GET /leads` (except `page` and `limit` — exports all matching records).

```
GET /export/leads/csv?status=qualified&source=Instagram
```

Returns a CSV file download with headers:
```
ID, Name, Email, Phone, Company, Status, Source, Created By, Created At
```

---

## Users

All user endpoints are **admin only**.

**GET `/users`**
```json
// response 200
{ "success": true, "data": [ { "_id": "...", "name": "...", "email": "...", "role": "sales_user" } ] }
```

**PATCH `/users/:id/role`**
```json
// body
{ "role": "admin" }

// response 200
{ "success": true, "data": { "_id": "...", "role": "admin" } }
```
> Cannot change your own role.

**DELETE `/users/:id`**
```json
// response 200
{ "success": true, "message": "User deleted" }
```
> Cannot delete your own account.

---

## Error Format

All errors follow this shape:

```json
{ "success": false, "message": "Description of what went wrong" }
```

| Status | Meaning |
|---|---|
| 400 | Validation error — check request body |
| 401 | Missing or expired access token |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 409 | Conflict — email already exists |
| 429 | Too many login attempts — wait 15 minutes |
| 500 | Internal server error |