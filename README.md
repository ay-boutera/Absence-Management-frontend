<h1 align="center">AMS: Absence Management System (web app)</h1>

<p align="center">
  The web app of ESI-SBA's attendance platform, for administrators and teachers:
  accounts, imports, timetables, attendance per session, and absence exports.
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white">
  <img alt="Zustand" src="https://img.shields.io/badge/state-Zustand-443E38">
  <img alt="Recharts" src="https://img.shields.io/badge/charts-Recharts-22B5BF">
</p>

## Overview

AMS replaces paper attendance sheets at the Higher School of Computer Science of Sidi Bel Abbès (ESI-SBA). This repository is the web app used by **administrators** and **teachers**; students use the mobile app. Year-end project (PFA), 2025–2026.

| Repository                                                                               | Role                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Absence-Management-frontend** (this one)                                               | Web app for admins and teachers (Next.js) |
| [Absence-Management-backend](https://github.com/ay-boutera/Absence-Management-backend)   | REST and WebSocket API (FastAPI)          |
| [Absence-Management-mobile](https://github.com/ay-boutera/Absence-Management-mobile)     | Mobile app for students (Flutter)         |
| [Absence-Management](https://github.com/ay-boutera/Absence-Management)                   | All three as Git submodules               |

## Features

**Sign-in**

- Email and password, or Google sign-in (through the backend, `@esi-sba.dz` accounts only)
- Forgotten password and reset by email; change of password in the settings
- Pages guarded by role (admin or teacher), and automatic logout after a period of inactivity

**Administrators**

- Accounts: list, view, add and edit students, teachers and administrators; change a student's status
- Imports: students, teachers and the timetable from CSV files, checked before sending, with a report of the rows in error and an import history
- Timetable and groups of the whole school
- Absence exports (CSV), with a preview

**Teachers**

- Today's sessions, and for each one the list of students, attendance marking and a live summary (present, absent, pending)
- Their groups, each student's absence history, and absence exports
- Their timetable

## Project status

The app was built in sprints during the project, and some screens are not connected to the API yet:

- **Connected:** sign-in, accounts, imports and import history, groups, timetables, sessions and attendance, exports, settings.
- **Interface ready, sample data:** the admin and teacher dashboards (charts, threshold alerts), the justifications and rooms tables, the exam absences page, and the QR code window (it shows a placeholder, not the rotating code that the API provides at `GET /api/v1/sessions/{id}/qr-code`).

## Tech stack

| Area      | Tools                                                    |
| --------- | -------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, JavaScript            |
| Styling   | Tailwind CSS                                             |
| State     | Zustand (session and user)                               |
| Data      | Axios, through a Next.js rewrite to the backend          |
| Charts    | Recharts                                                 |
| PDF       | jsPDF and html2canvas                                    |

## Getting started

**Requirements:** Node.js 20.9 or later, and the [backend](https://github.com/ay-boutera/Absence-Management-backend) running.

```bash
git clone https://github.com/ay-boutera/Absence-Management-frontend.git
cd Absence-Management-frontend/my-app

npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

Open http://localhost:5173.

Requests to `/api/v1/*` are forwarded by Next.js to `NEXT_PUBLIC_API_URL` + `/v1/*` (see `next.config.mjs`), so the browser only talks to the web app's own address and the backend's cookies work without cross-site settings.

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Development server on port 5173      |
| `npm run build` | Production build                     |
| `npm run start` | Serves the production build          |
| `npm run lint`  | ESLint                               |

## Project structure

```
my-app/
├── middleware.js            # redirects by session and role
├── next.config.mjs          # proxy of /api/v1 to the backend
└── src/
    ├── app/
    │   ├── (auth)/          # login, Google callback, forgotten and reset password
    │   └── (dashboard)/
    │       ├── admin/       # accounts, imports, groups, timetable, justifications, settings...
    │       └── teacher/     # sessions, attendance, timetable, settings
    ├── components/          # tables, modals, charts, timetable grid, layout
    ├── hooks/               # auth, attendance, imports, exports, auto logout
    ├── services/            # API calls, one file per area
    └── store/               # Zustand store for the signed-in user
```

## Contributing

Work happens on feature branches (`feature/us-XX-description`) merged through pull requests. The sprint plans are in [`sprint1.md`](sprint1.md), [`sprint2.md`](sprint2.md) and [`Sprint3.md`](Sprint3.md).

## Team

- [trarifouad](https://github.com/trarifouad): web app
- [Boutera Ahmed Yassine](https://github.com/ay-boutera): backend
- [i-brahmi](https://github.com/i-brahmi): mobile app
