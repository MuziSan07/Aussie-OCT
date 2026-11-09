# Aussie-OCT

A full-stack web application for practising the **Australian Citizenship Test**.
Students register, work through chapter-based practice questions and timed
simulation tests, track their progress, and earn achievements. Administrators
manage chapters, questions, and users through an admin dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-18+-339933.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Create React App), React Router |
| Backend | Node.js, Express 5 |
| ORM / Database | Prisma 6, PostgreSQL |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Uploads | Multer (served from `/uploads`) |

---

## Project structure

```
Aussie-OCT/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── controllers/              # Request handlers (auth, chapters, questions, ...)
│   ├── routes/                   # Express routers mounted under /api/*
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Prisma migrations
│   ├── prismaClient.js           # Shared PrismaClient instance
│   ├── .env.example              # Backend environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/                # Route-level views
│   │   ├── components/           # Reusable UI components
│   │   └── api/api.js            # Backend API client
│   └── package.json
├── LICENSE
└── README.md
```

---

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database

---

## Backend setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGINS

# Apply the database schema
npx prisma migrate deploy
npx prisma generate

# Start the API (development, with auto-reload)
npm run dev
# or production
npm start
```

The API runs on `http://localhost:5000` by default.

### Backend environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma) |
| `JWT_SECRET` | **Required.** Secret used to sign JWTs. The server refuses to start without it. |
| `PORT` | Port the API listens on (default `5000`) |
| `CORS_ORIGINS` | Comma-separated allow-list of frontend origins (default `http://localhost:3000`) |

---

## Frontend setup

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000` and talks to the backend at
`http://localhost:5000`.

---

## API overview

All endpoints are served under `/api`:

| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Registration and login |
| `/api/chapters` | Chapter management |
| `/api/questions` | Question management and the test engine |
| `/api/practice` | Student practice test listings |
| `/api/quiz` | Quiz endpoints |
| `/api/stimulation-test` | Simulation (mock exam) tests |
| `/api/profile` | User profiles |
| `/api/users` | Admin user management |
| `/api/flagged` | Flagged questions |
| `/api/overview` | Dashboard overview data |
| `/api/admin` | Admin operations |
| `/api/health` | Health check |

---

## Security notes

- Secrets are read from the environment; never commit a real `.env`.
- `JWT_SECRET` has no insecure default — the backend fails fast if it is unset.
- CORS is restricted to the origins listed in `CORS_ORIGINS`.
- `node_modules`, `.env`, build output, and uploads are git-ignored.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
