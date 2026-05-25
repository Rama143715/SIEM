from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "SIEM_Application_and_Database_Commands.pdf"

PROJECT_TITLE = "AI SIEM Platform"
YEAR = "2025-26"


styles = getSampleStyleSheet()
styles.add(ParagraphStyle("TitleCenter", parent=styles["Title"], fontName="Times-Bold", fontSize=18, leading=24, alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle("Section", parent=styles["Heading2"], fontName="Times-Bold", fontSize=14, leading=18, spaceBefore=12, spaceAfter=8))
styles.add(ParagraphStyle("Body", parent=styles["BodyText"], fontName="Times-Roman", fontSize=12, leading=18, alignment=TA_LEFT, spaceAfter=6))
styles.add(ParagraphStyle("CodeBlock", parent=styles["Code"], fontName="Courier", fontSize=9, leading=12, leftIndent=0.15 * inch, spaceAfter=10))


def footer(canvas, doc):
    page = canvas.getPageNumber()
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 0.45 * inch, f"{PROJECT_TITLE} Commands Guide - {YEAR}")
    canvas.drawCentredString(A4[0] / 2, 0.45 * inch, str(page))
    canvas.restoreState()


def p(text):
    return Paragraph(text, styles["Body"])


def h(text):
    return Paragraph(text, styles["Section"])


def code(text):
    return Preformatted(text.strip(), styles["CodeBlock"])


def build():
    OUT.parent.mkdir(exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=1.2 * inch,
        rightMargin=1.0 * inch,
        topMargin=1.0 * inch,
        bottomMargin=1.0 * inch,
    )

    story = [
        Spacer(1, 0.5 * inch),
        Paragraph("APPLICATION START AND DATABASE COMMANDS", styles["TitleCenter"]),
        Paragraph("AI SIEM Platform", styles["TitleCenter"]),
        p("This PDF contains the important commands required to start the SIEM application, initialize the database, view database records, run demo attack logs, and stop/restart the services."),
        h("1. Open Project Folder"),
        code(r'''
cd "C:\Users\bpava\OneDrive\Documents\New project\Wazuh-SIEM-Security-Lab\siem-platform"
'''),
        h("2. Build Docker Images"),
        p("Run this after Docker Desktop is open. This builds backend and frontend images."),
        code(r'''
docker compose build
'''),
        h("3. Start Database and Redis"),
        p("Start only PostgreSQL and Redis first."),
        code(r'''
docker compose up -d postgres redis
'''),
        h("4. Run Database Migrations"),
        p("This creates all required database tables."),
        code(r'''
docker compose run --rm backend npm run migrate
'''),
        h("5. Add Default Demo Data"),
        p("This creates default admin user, demo source keys, and starter rules."),
        code(r'''
docker compose run --rm backend npm run seed
'''),
        h("6. Start Full Application"),
        p("This starts PostgreSQL, Redis, backend, and frontend."),
        code(r'''
docker compose up -d
'''),
        h("7. Check Running Containers"),
        code(r'''
docker compose ps
'''),
        p("Expected services: postgres, redis, backend, frontend. They should be running or healthy."),
        h("8. Open Application"),
        p("Open this URL in browser:"),
        code(r'''
http://localhost:5173
'''),
        p("Default login after seed:"),
        code(r'''
Email: admin@siem.local
Password: changeme123
'''),
        PageBreak(),
        h("9. Run Demo Attack Simulation"),
        p("This sends demo security events to the SIEM collector."),
        code(r'''
.\tools\simulate-attacks.ps1
'''),
        p("After running it, check Dashboard, Logs, Alerts, and Incidents pages."),
        h("10. Backend Health Check"),
        code(r'''
curl http://localhost:3001/health
'''),
        p("PowerShell alternative:"),
        code(r'''
Invoke-RestMethod http://localhost:3001/health
'''),
        h("11. Open PostgreSQL Shell"),
        code(r'''
docker compose exec postgres psql -U siem_user -d siem_db
'''),
        h("12. List Database Tables"),
        p("Type this inside psql and press Enter:"),
        code(r'''
\dt
'''),
        h("13. View User Records"),
        code(r'''
SELECT id, email, full_name, role, is_active, created_at FROM users;
'''),
        h("14. View Log Source Records"),
        code(r'''
SELECT id, name, type, ip_address, is_active, last_seen FROM log_sources;
'''),
        h("15. View Latest Log Records"),
        code(r'''
SELECT id, source_name, severity, category, message, ip_src, user_name, ts
FROM logs
ORDER BY ts DESC
LIMIT 10;
'''),
        h("16. View Alert Records"),
        code(r'''
SELECT id, title, severity, status, source_name, occurrence, created_at
FROM alerts
ORDER BY created_at DESC
LIMIT 10;
'''),
        h("17. View Incident Records"),
        code(r'''
SELECT id, title, severity, status, assigned_to, created_at
FROM incidents
ORDER BY created_at DESC
LIMIT 10;
'''),
        h("18. View Rule Records"),
        code(r'''
SELECT id, name, rule_type, severity, enabled, created_at
FROM rules
ORDER BY created_at DESC;
'''),
        h("19. Exit PostgreSQL Shell"),
        code(r'''
\q
'''),
        PageBreak(),
        h("20. One-Line Database Commands from PowerShell"),
        p("Use these commands directly from PowerShell without entering psql."),
        code(r'''
docker compose exec postgres psql -U siem_user -d siem_db -c "\dt"

docker compose exec postgres psql -U siem_user -d siem_db -c "SELECT id, email, role FROM users;"

docker compose exec postgres psql -U siem_user -d siem_db -c "SELECT id, source_name, severity, message, ts FROM logs ORDER BY ts DESC LIMIT 10;"

docker compose exec postgres psql -U siem_user -d siem_db -c "SELECT id, title, severity, status, created_at FROM alerts ORDER BY created_at DESC LIMIT 10;"

docker compose exec postgres psql -U siem_user -d siem_db -c "SELECT id, title, severity, status, created_at FROM incidents ORDER BY created_at DESC LIMIT 10;"
'''),
        h("21. Stop Application"),
        code(r'''
docker compose down
'''),
        h("22. Start Again Later"),
        code(r'''
docker compose up -d
'''),
        h("23. Restart One Service"),
        code(r'''
docker compose restart backend
docker compose restart frontend
'''),
        h("24. View Backend Logs"),
        code(r'''
docker compose logs -f backend
'''),
        h("25. View Frontend Logs"),
        code(r'''
docker compose logs -f frontend
'''),
        h("26. View Database Logs"),
        code(r'''
docker compose logs -f postgres
'''),
        h("27. Important Ports"),
        code(r'''
Frontend:       http://localhost:5173
Backend API:    http://localhost:3001
PostgreSQL:     localhost:5432
Redis:          localhost:6379
Syslog UDP:     localhost:5514
'''),
        h("28. Notes"),
        p("Run database commands one by one inside psql. Do not paste \\dt and SELECT statements on the same line. If tables are missing, run migrations and seed again."),
    ]

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return OUT


if __name__ == "__main__":
    print(build())
