# Absence-Management Frontend

Web application for the Absence Management System — ESI Sidi Bel Abbès.

Built with **Next.js 15**, **Tailwind CSS**, and **shadcn/ui**.

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) — Framework
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI Components
- [Zustand](https://zustand-demo.pmnd.rs/) — State Management
- [Axios](https://axios-http.com/) — HTTP Client

---

## Getting Started

### Prerequisites

- Node.js `>= 20.9.0`
- npm `>= 9`

### Installation

```bash
# Clone the repo
git clone https://github.com/ay-boutera/Absence-Management-frontend.git
cd Absence-Management-frontend

# Enter the Next.js app
cd my-a

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Git Workflow

```bash
# Create your branch
git checkout -b feature/us-XX-description

# Push and open a Pull Request
git push origin feature/us-XX-description
```

> Never push directly to `main` — all changes go through Pull Requests.

---
