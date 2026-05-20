Role-Based Access Control (RBAC) — GigFlow
========================================

Purpose
-------
This document defines who may become an `admin` in GigFlow, why admin rights are restricted, and the approved procedure for granting elevated access.

Roles
-----
- `admin` — full access to user management, exports, and system settings. Intended only for trusted staff.
- `sales_user` — standard user who manages leads and day-to-day sales workflows.

Who may become `admin`
----------------------
Only existing `admin` users may promote another user to the `admin` role. New registrations always create users with the `sales_user` role.

Rationale
---------
Allowing arbitrary users to self-select `admin` is a critical security risk. Admins can access sensitive data and perform privileged actions that affect other users and business data.

Approved Promotion Workflow
---------------------------
1. An existing `admin` verifies the candidate user (e.g., identity, employment status).
2. The `admin` opens the Admin Panel → Users and selects the user to promote.
3. The system records an audit entry (who promoted whom, when) and updates the user's `role` to `admin`.

Recommended Controls
--------------------
- Audit logs for all role changes.
- Email notifications to promoted users.
- UI confirmation modal requiring the acting admin to confirm and optionally add a reason.
- Limit the number of admins and review admin list periodically.

Notes for developers
--------------------
- Registration: always create with `role: 'sales_user'`.
- Promotion endpoint: protected to `admin` only and must log actor + timestamp.
- Frontend: hide admin-only navigation and UI unless `user.role === 'admin'`.

Example policy snippet (frontend):

```tsx
// show admin link
{user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
```

Security is a shared responsibility — limit privileges, log changes, and review regularly.
