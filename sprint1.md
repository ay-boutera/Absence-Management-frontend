# Sprint 1 — Authentication & User Management

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026
> **Duration:** 2 weeks · **9 User Stories** · **37 Story Points**

---

## Sprint Goal

Set up complete authentication (email/password + Google OAuth 2.0), JWT session management, and role-based access control for Admin and Teacher roles.

---

## User Stories

| ID    | Role  | User Story                                   | Priority | Points | Status      |
| ----- | ----- | -------------------------------------------- | -------- | ------ | ----------- |
| US-01 | All   | Login with institutional email + password    | High     | 5      | Done        |
| US-02 | All   | Login with Google OAuth 2.0                  | High     | 8      | Done        |
| US-03 | All   | Reset password via email link (valid 30min)  | High     | 5      | Done        |
| US-04 | Admin | Create / edit / disable user accounts        | High     | 5      | In Progress |
| US-05 | Admin | Assign roles (Admin / Teacher)               | High     | 3      | In Progress |
| US-06 | All   | Auto logout after 30min inactivity           | Medium   | 3      | Done        |
| US-07 | All   | JWT auto-refresh (access 15min / refresh 7d) | Medium   | 3      | Done        |
| US-08 | Admin | View audit log (date, IP, status)            | Medium   | 3      | Blocked     |
| US-09 | All   | Clear error message on wrong credentials     | Low      | 2      | Done        |

---

## Files to Implement

### Pages

| File                                   | User Story          | Status      |
| -------------------------------------- | ------------------- | ----------- |
| `app/(auth)/layout.jsx`                | All auth pages      | Done        |
| `app/(auth)/login/page.jsx`            | US-01, US-02, US-09 | Done        |
| `app/(auth)/forgot-password/page.jsx`  | US-03               | Done        |
| `app/(auth)/reset-password/page.jsx`   | US-03               | Done        |
| `app/(dashboard)/layout.jsx`           | US-04, US-05        | Done        |
| `app/(dashboard)/admin/users/page.jsx` | US-04, US-05        | Done        |
| `app/(dashboard)/admin/audit/page.jsx` | US-08               | Blocked     |

### Components

| File                                     | User Story   | Status      |
| ---------------------------------------- | ------------ | ----------- |
| `components/auth/LoginForm.jsx`          | US-01, US-09 | Done        |
| `components/auth/GoogleOAuthButton.jsx`  | US-02        | Done        |
| `components/auth/ForgotPasswordForm.jsx` | US-03        | Done        |
| `components/auth/ResetPasswordForm.jsx`  | US-03        | Done        |
| `components/layout/Sidebar.jsx`          | US-04, US-05 | Done        |
| `components/layout/Navbar.jsx`           | US-04        | Done        |
| `components/layout/RoleGuard.jsx`        | US-05        | Done        |
| `components/shared/DataTable.jsx`        | US-04, US-08 | Done        |
| `components/shared/StatusBadge.jsx`      | US-04        | Done        |
| `components/shared/ConfirmDialog.jsx`    | US-04        | Done        |
| `components/shared/EmptyState.jsx`       | US-04        | Done        |

### Logic

| File                      | User Story                          | Status |
| ------------------------- | ----------------------------------- | ------ |
| `lib/constants.js`        | ROLES, STATUSES, TOKEN config       | Done   |
| `lib/utils.js`            | Date format, role redirect helpers  | Done   |
| `store/authStore.js`      | US-01 to US-07                      | Done   |
| `services/api.js`         | All — Axios instance + interceptors | Done   |
| `services/authService.js` | US-01, US-02, US-03, US-07          | Done   |
| `services/userService.js` | US-04, US-05                        | Done   |
| `hooks/useAuth.js`        | US-07                               | Done   |
| `hooks/useAutoLogout.js`  | US-06                               | Done   |
| `hooks/useRoleGuard.js`   | US-05                               | Done   |
| `middleware.js`           | US-05 — server-side route guard     | Done   |

---

## Backend Endpoints

| Endpoint                                   | Needed By             | Status            |
| ------------------------------------------ | --------------------- | ----------------- |
| `POST /api/v1/auth/login`                  | LoginForm             | Working           |
| `POST /api/v1/auth/logout`                 | Sidebar               | Working           |
| `POST /api/v1/auth/refresh`                | useAuth               | Working           |
| `GET  /api/v1/auth/me`                     | useAuth               | Working           |
| `GET  /api/v1/auth/google`                 | GoogleOAuthButton     | Working           |
| `GET  /api/v1/auth/google/callback`        | Google OAuth redirect | Working           |
| `POST /api/v1/auth/reset-password`         | ForgotPasswordForm    | Working           |
| `POST /api/v1/auth/reset-password/confirm` | ResetPasswordForm     | Working           |
| `POST /api/v1/auth/change-password`        | Profile (future)      | Working           |
| `GET  /api/v1/users/`                      | Users page            | Working           |
| `POST /api/v1/users/`                      | Users page            | Working           |
| `GET  /api/v1/users/me`                    | Navbar                | Working           |
| `PATCH /api/v1/users/:id/disable`          | Users page            | Missing — needed  |
| `PATCH /api/v1/users/:id/role`             | Users page            | Missing — needed  |
| `GET  /api/v1/audit`                       | Audit log page        | Missing — blocked |

---

## Blockers

| Blocker                            | Solution                                                   |
| ---------------------------------- | ---------------------------------------------------------- |
| Missing `PATCH /users/:id/disable` | Backend teammate needs to implement                        |
| Missing `PATCH /users/:id/role`    | Backend teammate needs to implement                        |
| Missing `GET /audit`               | Backend teammate needs to implement — page skipped for now |

---

## Remaining Tasks

### User Management

- [x] Build `StatusBadge.jsx` — active / disabled badge
- [x] Build `ConfirmDialog.jsx` — reusable confirm modal
- [x] Build `EmptyState.jsx` — empty list fallback
- [x] Build `DataTable.jsx` — table with search + pagination
- [x] Complete `/admin/users` page — create + list users
- [ ] Add disable user button — waiting on `PATCH /users/:id/disable`
- [ ] Add assign role dropdown — waiting on `PATCH /users/:id/role`

### Testing

- [x] Test login with email + password
- [x] Test login with Google OAuth
- [x] Test forgot password + reset password flow
- [x] Test wrong credentials error (US-09)
- [x] Test auto logout after 30min
- [x] Test JWT auto-refresh
- [x] Test role redirect after login
- [x] Test create user
- [ ] Test disable user (once backend ready)
- [ ] Test assign role (once backend ready)

### Sprint Review Prep

- [x] Code cleanup
- [x] All PRs reviewed and merged to main
- [x] Demo ready for Sprint Review
- [x] Deploy to staging

## Definition of Done

- [x] User can login with email + password
- [x] User can login with Google OAuth
- [x] User receives reset link by email and can reset via confirm page
- [x] Admin can create / edit / disable users
- [ ] Admin can assign roles (Admin / Teacher)
- [x] Wrong credentials show a clear error message
- [x] Session auto-expires after 30min inactivity
- [x] JWT refreshes automatically every 14min
- [ ] Admin can view audit log — blocked
- [x] All routes protected — no access without login
- [x] All PRs reviewed and merged to main
- [x] Demo approved in Sprint Review
- [x] Deployed to staging

> Never push to `main` directly — open a PR and wait for lead developer approval.
