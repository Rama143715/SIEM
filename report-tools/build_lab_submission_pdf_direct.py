from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = "docs/AI_SIEM_Platform_Complete_Lab_Submission_Guide.pdf"


def styles():
    base = getSampleStyleSheet()
    base.add(ParagraphStyle(
        name="CoverTitle",
        parent=base["Title"],
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=31,
        textColor=colors.HexColor("#0B2545"),
        alignment=TA_CENTER,
        spaceAfter=12,
    ))
    base.add(ParagraphStyle(
        name="CoverSubtitle",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#4B5563"),
        alignment=TA_CENTER,
        spaceAfter=18,
    ))
    base.add(ParagraphStyle(
        name="H1Custom",
        parent=base["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#2E74B5"),
        spaceBefore=12,
        spaceAfter=8,
    ))
    base.add(ParagraphStyle(
        name="H2Custom",
        parent=base["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#1F4D78"),
        spaceBefore=8,
        spaceAfter=5,
    ))
    base.add(ParagraphStyle(
        name="BodyCustom",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=9.8,
        leading=13,
        textColor=colors.HexColor("#111827"),
        spaceAfter=6,
    ))
    base.add(ParagraphStyle(
        name="Small",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#374151"),
    ))
    base.add(ParagraphStyle(
        name="Callout",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#111827"),
        leftIndent=6,
        rightIndent=6,
        spaceAfter=8,
    ))
    return base


S = styles()


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.line(0.75 * inch, 10.25 * inch, 7.75 * inch, 10.25 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawString(0.75 * inch, 10.35 * inch, "AI SIEM Platform Lab Submission Guide")
    canvas.drawRightString(7.75 * inch, 0.45 * inch, f"Page {doc.page}")
    canvas.restoreState()


def p(text, style="BodyCustom"):
    return Paragraph(text, S[style])


def h1(text):
    return Paragraph(text, S["H1Custom"])


def h2(text):
    return Paragraph(text, S["H2Custom"])


def bullet_list(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=14) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=16,
        bulletFontSize=7,
    )


def number_list(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=16) for item in items],
        bulletType="1",
        leftIndent=18,
    )


def callout(title, text):
    content = [[Paragraph(f"<b>{title}:</b> {text}", S["Callout"])]]
    table = Table(content, colWidths=[6.55 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F4F6F9")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return KeepTogether([table, Spacer(1, 8)])


def table(headers, rows, widths):
    data = [[Paragraph(f"<b>{h}</b>", S["Small"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(value), S["Small"]) for value in row])
    t = Table(data, colWidths=[w * inch for w in widths], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E8EEF5")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1F4D78")),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    return KeepTogether([t, Spacer(1, 9)])


def build():
    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.75 * inch,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])

    story = []
    story.append(Spacer(1, 1.0 * inch))
    story.append(p("AI SIEM Platform", "CoverTitle"))
    story.append(p("Complete Lab Submission Guide, Project Information, Workflow, and Technology Stack", "CoverSubtitle"))
    story.append(callout("Project summary", "A full-stack Security Operations Center prototype that collects security logs, detects threats with rules, creates alerts, supports incident tracking, and provides AI-assisted analysis with offline fallback mode."))
    story.append(table(["Item", "Details"], [
        ["Application URL", "http://127.0.0.1:5173"],
        ["Database GUI", "http://127.0.0.1:8080"],
        ["Default user", "admin@siem.local / changeme123"],
        ["Submission purpose", "Demonstrate SIEM architecture, detection rules, alert handling, incidents, and database records."],
    ], [1.55, 5.0]))
    story.append(PageBreak())

    story.append(h1("1. Project Overview"))
    story.append(p("The AI SIEM Platform is a lab-ready SIEM and SOC dashboard. It simulates how security teams collect logs, detect suspicious behavior, create alerts, and investigate incidents. The platform is designed for a real-world inspired demonstration while staying safe for a local lab machine."))
    story.append(bullet_list([
        "Central dashboard for threat monitoring and SOC metrics.",
        "Log ingestion through REST APIs, collector endpoint, and syslog UDP.",
        "Rule-based alerting for brute force, SQL injection, credential dumping, and suspicious login chains.",
        "Incident management for analyst investigation and response tracking.",
        "AI Analysis page with offline deterministic analysis when no external API key is configured.",
        "PostgreSQL database GUI for showing stored users, logs, alerts, rules, incidents, and audit records.",
    ]))

    story.append(h1("2. Technology Stack"))
    story.append(table(["Layer", "Technology", "Purpose"], [
        ["Frontend", "React 18, Vite, TailwindCSS, Recharts", "SOC dashboard, pages, charts, forms, and analyst workflow."],
        ["Backend", "Node.js, Express, Socket.IO", "Authentication, APIs, ingestion, alert processing, and real-time updates."],
        ["Database", "PostgreSQL 16", "Stores users, logs, alerts, incidents, rules, audit logs, and AI analysis history."],
        ["Cache/Queue", "Redis 7", "Supports rate limiting and background processing behavior."],
        ["Security", "JWT, bcrypt, Helmet, CORS, Joi", "Authentication, password hashing, API hardening, and validation."],
        ["Deployment", "Docker Compose", "Runs frontend, backend, Postgres, Redis, and Adminer locally."],
        ["Database GUI", "Adminer", "Browser-based GUI for viewing database records."],
        ["AI", "Anthropic SDK with offline fallback", "Online Claude integration when key exists; offline lab mode otherwise."],
    ], [1.05, 2.05, 3.45]))

    story.append(h1("3. System Architecture"))
    story.append(table(["Component", "Port", "Role"], [
        ["Frontend container", "5173 -> 80", "Serves the React application through Nginx."],
        ["Backend container", "3001", "Provides REST API, auth, ingestion, rules, alerts, and Socket.IO."],
        ["PostgreSQL container", "5432", "Stores persistent application data."],
        ["Redis container", "6379", "Supports rate limits and service coordination."],
        ["Adminer container", "8080", "Database GUI for lab inspection."],
        ["Syslog UDP", "5514", "Receives syslog-style security events."],
    ], [1.9, 1.15, 3.5]))
    story.append(callout("Architecture flow", "Browser -> React frontend -> Express backend API -> PostgreSQL/Redis. Security logs enter the backend, rules detect suspicious patterns, alerts are created, and analysts review results in the SOC interface."))

    story.append(h1("4. Application Workflow"))
    story.append(number_list([
        "User logs in with the admin account.",
        "Security events are ingested through API, collector, demo script, or syslog.",
        "Backend normalizes and stores events in PostgreSQL.",
        "Detection rules check each event or event pattern.",
        "Matching rules create alerts with severity and status.",
        "Dashboard, Logs, Alerts, Incidents, AI Analysis, Rules, and Settings pages allow analyst investigation.",
        "Resolved alerts and incident records show response completion.",
    ]))

    story.append(h1("5. Main Application Modules"))
    story.append(table(["Module", "What it shows", "How to explain it"], [
        ["Dashboard", "Threat metrics, open alerts, severity chart, source activity, asset health.", "SOC overview screen."],
        ["Logs", "Ingested event records with search/filtering.", "Raw and normalized security evidence is stored here."],
        ["Alerts", "Rule detections with acknowledge and resolve actions.", "Open -> Acknowledge -> Resolve is the analyst workflow."],
        ["Incidents", "Investigation records and timelines.", "Analysts group related alerts/logs into a case."],
        ["AI Analysis", "Offline or API-backed triage notes.", "Summarizes attack type, indicators, MITRE hints, and response steps."],
        ["Rules", "Detection rule configuration.", "Rules convert suspicious logs into alerts."],
        ["Settings", "Access details, login/logout, password change, project about.", "User account and project explanation area."],
    ], [1.1, 2.7, 2.75]))

    story.append(h1("6. How to Start the Project"))
    story.append(number_list([
        'Open PowerShell: cd "C:\\Users\\bpava\\OneDrive\\Documents\\New project\\Wazuh-SIEM-Security-Lab\\siem-platform"',
        "Start Docker Desktop and wait until the engine is running.",
        "Run: docker compose up -d --build",
        "Check status: docker compose ps",
        "Open the application: http://127.0.0.1:5173",
        "Login with admin@siem.local and password changeme123.",
    ]))
    story.append(table(["Command", "Purpose"], [
        ["docker compose up -d --build", "Build and start all services."],
        ["docker compose ps", "Confirm frontend, backend, postgres, redis, and adminer are running."],
        ["docker compose logs --tail 80 backend", "Check backend errors or login/API activity."],
        ["docker compose down", "Stop the stack while keeping database data."],
        ["docker compose down -v", "Reset all database data. Use only when a fresh database is required."],
    ], [2.7, 3.85]))

    story.append(h1("7. Demo Scenario for Submission"))
    story.append(p("Run the attack simulation after the stack is running and login works:"))
    story.append(callout("Demo command", "powershell.exe -ExecutionPolicy Bypass -File .\\tools\\simulate-attacks.ps1 -BaseUrl http://127.0.0.1:3001"))
    story.append(number_list([
        "Run the demo script and copy the Run ID shown in PowerShell.",
        "Open Dashboard and show updated threat metrics and charts.",
        "Open Logs and search the Run ID to show ingested events.",
        "Open Alerts and show detections for brute force, SQL injection, suspicious login, and credential dumping.",
        "Acknowledge an alert to show investigation started.",
        "Resolve an alert to show the issue is handled.",
        "Open AI Analysis and explain offline analysis mode if no real API key is configured.",
        "Open Adminer database GUI and show logs, alerts, users, rules, incidents, and audit records.",
    ]))

    story.append(h1("8. Database GUI and Important Tables"))
    story.append(table(["Adminer field", "Value"], [
        ["URL", "http://127.0.0.1:8080"],
        ["System", "PostgreSQL"],
        ["Server", "postgres"],
        ["Username", "siem_user"],
        ["Password", "password"],
        ["Database", "siem_db"],
    ], [1.65, 4.9]))
    story.append(table(["Table", "Purpose"], [
        ["users", "Application users, role, active status, and password rotation timestamp."],
        ["logs", "Security events ingested into the SIEM."],
        ["alerts", "Threat detections generated by enabled rules."],
        ["incidents", "Analyst investigation and response records."],
        ["rules", "Detection rules and conditions."],
        ["log_sources", "Allowed log sources and API keys."],
        ["audit_log", "Login, profile, password, and other important user actions."],
        ["ai_analyses", "AI/offline analysis request history and output."],
    ], [1.35, 5.2]))
    story.append(callout("Database safety", "Do not click Drop, Truncate, or Delete during submission unless you intentionally want to remove data."))

    story.append(h1("9. Account and Password Management"))
    story.append(p("The Settings page supports access management for the logged-in user. The user can update full name, update email, change password, and log out. Passwords are stored as bcrypt hashes, not plain text."))
    story.append(bullet_list([
        "Default account: admin@siem.local / changeme123.",
        "Password change requires current password, new password, and confirmation.",
        "The system tracks password_changed_at in the users table.",
        "The Settings page shows the 15-day password rotation status.",
        "Logout returns the user to the login screen.",
    ]))

    story.append(h1("10. AI Analysis Mode"))
    story.append(p("The project can use a real Anthropic API key, but it is not required for the lab. If ANTHROPIC_API_KEY is empty, the application uses deterministic offline SOC analysis mode."))
    story.append(table(["Mode", "When used", "How to explain"], [
        ["Offline mode", "No ANTHROPIC_API_KEY in .env", "Safe lab mode that still extracts attack type, indicators, MITRE hints, and response steps."],
        ["Online mode", "A real Anthropic API key is configured", "Calls Claude through the backend for live AI analysis."],
    ], [1.2, 2.1, 3.25]))

    story.append(h1("11. Common Issues and Fixes"))
    story.append(table(["Issue", "Fix"], [
        ["Docker CLI permission denied", "Open Docker Desktop and run commands from the real Windows account."],
        ["localhost does not open in Codex browser", "Use http://127.0.0.1:5173."],
        ["Login failed on 127.0.0.1", "Backend CORS must allow both localhost and 127.0.0.1."],
        ["PowerShell blocks npm scripts", "Use npm.cmd run build."],
        ["Need database GUI", "Open Adminer at http://127.0.0.1:8080."],
        ["Need fresh database", "Use docker compose down -v, then rebuild and seed. This deletes existing data."],
    ], [2.25, 4.3]))

    story.append(h1("12. Viva Explanation Script"))
    story.append(callout("Short answer", "This is an AI-assisted SIEM platform. It collects logs, stores them in PostgreSQL, applies detection rules, creates alerts, supports incidents, and provides SOC dashboard views for investigation."))
    story.append(bullet_list([
        "Acknowledge means the analyst has started investigating an alert.",
        "Resolve means the alert has been handled and closed.",
        "Threats Blocked is a dashboard metric showing detected/handled malicious activity.",
        "Offline AI mode is used because a real paid API key is not required for the lab.",
        "Adminer proves the backend data is actually stored in PostgreSQL.",
    ]))

    story.append(h1("13. Final Submission Checklist"))
    story.append(bullet_list([
        "Docker Desktop is running.",
        "docker compose ps shows all containers running.",
        "Frontend opens at http://127.0.0.1:5173.",
        "Login works with admin@siem.local.",
        "Demo attack simulation has been run.",
        "Logs and alerts are visible in the UI.",
        "Adminer opens and shows PostgreSQL tables.",
        "Settings shows access, login/logout, password change, and about project.",
    ]))

    doc.build(story)


if __name__ == "__main__":
    build()
