# Pomo Villa

A production-ready MVP for a Mazandaran real-estate marketplace and advisor CRM.

## Features
- Public landing page and portfolio cards
- Advisor, owner, and admin flows
- Express API with JSON persistence
- Static frontend served from `public/`
- Docker-ready setup

## Quick start

```bash
npm install
npm start
```

Then browse to:

http://localhost:3000

## Environment
Copy `.env.example` to `.env` and adjust as needed.

## Production next steps
- Replace JSON storage with MongoDB/PostgreSQL
- Use JWT auth and real role-based permissions
- Connect real SMS and payment integrations
- Add image upload and storage
- Deploy on Render, Railway, Vercel, or Docker host
