# AI SIEM Platform

Production-style full-stack SIEM platform scaffold with real-time ingestion, rule-based alerting, incident management, and AI analysis.

## Stack
- Frontend: React 18 + Vite + TailwindCSS + Recharts
- Backend: Node.js + Express + Socket.IO
- Data: PostgreSQL + Redis
- Auth: JWT + bcrypt
- AI: Anthropic Claude (`claude-sonnet-4-20250514`)
- Ingestion: REST API + Syslog UDP listener (default host port `5514/udp`)
- Deployment: Docker Compose

## Quick Start
For submission-day commands and demo flow, use [Lab Submission Guide](docs/LAB_SUBMISSION_GUIDE.md).

1. Copy environment:
   - `cp .env.example .env`
2. Replace placeholder secrets in `.env`:
   - set a strong `POSTGRES_PASSWORD`
   - set different 32+ character values for `JWT_SECRET` and `JWT_REFRESH_SECRET`
3. Start infra:
   - `docker compose up -d postgres redis`
4. Run migrations and seed:
   - `docker compose run --rm backend npm run migrate`
   - `docker compose run --rm backend npm run seed`
5. Start all services:
   - `docker compose up -d`

Frontend: http://localhost:5173  
Backend: http://localhost:3001

Default admin:
- Email: `admin@siem.local`
- Password: `changeme123`

Demo log source API keys (seeded, SHA256-hashed in DB):
- `firewall_demo_key`
- `endpoint_demo_key`

## Real-World SOC Demo

Use the runbook to prove the platform end to end with attack monitoring, log analysis, alerts, incidents, AI Analysis, and rules:

- [Real World Attack Monitoring Runbook](docs/REAL_WORLD_ATTACK_MONITORING_RUNBOOK.md)
- [Real World SOC Ingestion](docs/REAL_WORLD_SOC_INGESTION.md)

After the stack is running, launch the built-in attack simulation:

```powershell
.\tools\simulate-attacks.ps1
```

Expected proof points:

- Logs page shows brute force, SQL injection, login correlation, and credential dumping events.
- Alerts page shows triggered detections from enabled rules.
- Incidents page can link related alerts/logs and track the response timeline.
- AI Analysis can triage selected logs or incident evidence.

For real tools and agents, send normalized or raw security JSON to `POST /api/collector/events` with `x-siem-source-key`. The collector supports Wazuh, Windows/Sysmon-style events, Suricata EVE, Zeek, and generic JSON.

For syslog testing, send UDP traffic to host port `5514` by default. The container uses a high internal port so the backend can run as a non-root user.

## Security Highlights
- JWT auth enforced on all API routes except `/api/auth/login` and `/api/auth/refresh`
- Role-based access controls (`viewer`, `analyst`, `admin`)
- Redis-backed rate limits
- Joi input validation on critical write endpoints
- Parameterized SQL queries throughout models/controllers
- Helmet/CORS hardening
- Audit logs for sensitive actions
- Docker services include restart policies and health checks
- PostgreSQL, Redis, backend, and frontend are bound to localhost in the default Compose file

## Notes
- If `ANTHROPIC_API_KEY` is unset, AI analysis uses deterministic offline SOC mode, extracts observable IOCs and MITRE hints, and records request history.
- Syslog UDP listener starts on `SYSLOG_UDP_PORT` (default `5514`).

## Production Readiness Status
This project is a real-world inspired SOC/SIEM prototype with production-style structure. Before exposing it outside a lab machine, complete these items:

- Add HTTPS through a reverse proxy such as Nginx or Caddy.
- Rotate the seeded admin password and demo source API keys.
- Add refresh-token rotation and server-side refresh-token revocation.
- Add automated API, frontend, and end-to-end tests.
- Add database backup scheduling, retention policy, and restore drills.
- Add centralized container logs and host-level monitoring.
- Review firewall rules before exposing any port beyond localhost.
