# AI SIEM Platform

Production-style full-stack SIEM platform scaffold with real-time ingestion, rule-based alerting, incident management, and AI analysis.

## Stack
- Frontend: React 18 + Vite + TailwindCSS + Recharts
- Backend: Node.js + Express + Socket.IO
- Data: PostgreSQL + Redis
- Auth: JWT + bcrypt
- AI: Anthropic Claude (`claude-sonnet-4-20250514`)
- Ingestion: REST API + Syslog UDP listener (port 514)
- Deployment: Docker Compose

## Quick Start
1. Copy environment:
   - `cp .env.example .env`
2. Start infra:
   - `docker compose up -d postgres redis`
3. Run migrations and seed:
   - `docker compose run --rm backend npm run migrate`
   - `docker compose run --rm backend npm run seed`
4. Start all services:
   - `docker compose up -d`

Frontend: http://localhost:5173  
Backend: http://localhost:3001

Default admin:
- Email: `admin@siem.local`
- Password: `changeme123`

Demo log source API keys (seeded, SHA256-hashed in DB):
- `firewall_demo_key`
- `endpoint_demo_key`

## Security Highlights
- JWT auth enforced on all API routes except `/api/auth/login` and `/api/auth/refresh`
- Role-based access controls (`viewer`, `analyst`, `admin`)
- Redis-backed rate limits
- Joi input validation on critical write endpoints
- Parameterized SQL queries throughout models/controllers
- Helmet/CORS hardening
- Audit logs for sensitive actions

## Notes
- If `ANTHROPIC_API_KEY` is unset, AI analysis works in offline fallback mode and records request history.
- Syslog UDP listener starts on `SYSLOG_UDP_PORT` (default `514`).
