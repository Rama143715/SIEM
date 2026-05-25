from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "AI_SIEM_Platform_Project_Presentation_OPEN_THIS.pdf"
W, H = landscape((720, 405))

C = {
    "bg": colors.HexColor("#F7F8FC"),
    "navy": colors.HexColor("#0A2342"),
    "blue": colors.HexColor("#1557B0"),
    "cyan": colors.HexColor("#1AA6D9"),
    "teal": colors.HexColor("#0E8F7C"),
    "orange": colors.HexColor("#B45A1C"),
    "ink": colors.HexColor("#14213D"),
    "soft": colors.HexColor("#64748B"),
    "line": colors.HexColor("#D8E0EA"),
    "dark": colors.HexColor("#06111F"),
    "white": colors.white,
    "pale_blue": colors.HexColor("#EDF6FF"),
    "pale_green": colors.HexColor("#F0FDF4"),
    "pale_orange": colors.HexColor("#FFF7ED"),
}


slides = [
    ("cover", "AI SIEM Platform", "Real-Time Threat Monitoring and Security Operations Center", ["Lab Submission Project Presentation", "React, Node.js, PostgreSQL, Redis, Docker"], None),
    ("basic", "Abstract", "", ["The AI SIEM Platform centralizes security logs, detects suspicious activity, and supports SOC-style alert investigation.", "It demonstrates authentication, live dashboards, alert lifecycle handling, incident tracking, AI-assisted analysis, rule management, and database visibility.", "The project is containerized with Docker Compose so the full lab can be started and tested consistently."], ["Collect", "Detect", "Respond"]),
    ("basic", "Introduction", "", ["Security teams need continuous visibility into application and infrastructure events.", "A SIEM collects logs from multiple sources, correlates events, raises alerts, and supports investigation workflows.", "This project implements a compact SOC portal suitable for demonstrating SIEM concepts in a lab environment."], ["Logs", "Rules", "Alerts"]),
    ("basic", "Problem Statement", "", ["Manual log checking is slow and important events can be missed.", "Students need a working platform that shows alerts, incidents, logs, and database records in one place.", "The system should be easy to start before a lab demo and clear enough for examiners to understand."], ["Missed Events", "Slow Triage", "No Evidence"]),
    ("basic", "Objectives", "", ["Provide secure login/logout and role-based access for SOC users.", "Display logs, alerts, incidents, rules, and AI analysis from one dashboard.", "Support alert acknowledgement, resolution, blocked-threat clearing, and password change rotation.", "Run as a multi-container application using Docker."], ["Secure", "Live", "Auditable"]),
    ("basic", "Project Scope", "", ["Covers SIEM dashboard, log ingestion simulation, alert monitoring, incident management, AI analysis, settings, and database GUI access.", "Designed for academic lab demonstration rather than production SOC deployment.", "Includes guidance for starting services, login credentials, API endpoints, and database viewing."], ["SOC Portal", "Database", "Docker"]),
    ("basic", "Proposed Solution", "", ["A web-based SOC portal backed by REST APIs and PostgreSQL storage.", "Docker Compose runs frontend, backend, database, cache, and Adminer GUI together.", "Analysts can authenticate, review logs, manage alerts, investigate incidents, and explain project workflow."], ["Frontend", "API", "DB"]),
    ("basic", "Domain Survey", "", ["SIEM platforms such as Wazuh, Splunk, Elastic Security, and QRadar are used for log correlation and alerting.", "Common SOC operations include triage, acknowledgement, incident creation, investigation, and resolution.", "This project maps those concepts into a small practical implementation."], ["Wazuh", "Elastic", "Splunk"]),
    ("basic", "Existing System", "", ["Logs are often checked separately from alerts and incidents.", "Database records may only be visible through command-line tools.", "Password and access settings are usually not demonstrated in student mini-projects."], ["Manual", "Separate", "Slow"]),
    ("basic", "Proposed System", "", ["Unified portal for dashboard metrics, logs, alerts, incidents, AI analysis, rules, and settings.", "Adminer provides a browser-based database GUI for all application tables.", "Password change support encourages secure credential rotation every 15 days."], ["Unified", "Visible", "Guided"]),
    ("basic", "Project Modules", "", ["Authentication and access management", "Dashboard and SOC metrics", "Logs and log sources", "Alerts and incident workflow", "AI analysis and rule management", "Settings, password rotation, and project about section", "Database GUI using Adminer"], ["Auth", "Alerts", "Incidents"]),
    ("basic", "Hardware Requirements", "", ["Laptop or desktop with 8 GB RAM minimum", "Modern 64-bit processor", "10 GB free disk space for containers and volumes", "Stable local network/browser environment"], ["8 GB RAM", "CPU", "Disk"]),
    ("basic", "Software Requirements", "", ["Docker Desktop", "React frontend with Vite", "Express backend API", "PostgreSQL 16 database", "Redis cache", "Adminer database GUI"], ["Docker", "React", "Postgres"]),
    ("basic", "Technology: React", "", ["React builds the interactive SOC user interface.", "Reusable pages support dashboard, logs, alerts, incidents, AI analysis, rules, and settings.", "State management keeps authentication and profile data available across the app."], ["Pages", "State", "Routes"]),
    ("basic", "Technology: JavaScript and Vite", "", ["JavaScript is used across frontend and backend for faster development.", "Vite provides the frontend dev server at port 5173.", "REST API calls connect the browser UI to the backend service."], ["Vite", "REST", "Express"]),
    ("basic", "Technology: Tailwind CSS", "", ["Tailwind CSS creates the dark SOC-style interface.", "Utility classes make layout, spacing, color, and responsive behavior consistent.", "The settings page was simplified for access, login/logout, password change, and project information."], ["Layout", "Theme", "Responsive"]),
    ("basic", "Technology: Node.js, PostgreSQL and Redis", "", ["Node.js and Express expose authentication, logs, alerts, incidents, rules, and settings APIs.", "PostgreSQL stores users, alerts, audit log, incidents, rules, logs, and AI analyses.", "Redis supports fast state/cache operations in the stack."], ["Node", "SQL", "Redis"]),
    ("architecture", "System Architecture Diagram", "", ["Browser frontend communicates with backend REST APIs.", "Backend reads/writes PostgreSQL and uses Redis where needed.", "Adminer connects directly to PostgreSQL for GUI database inspection."], None),
    ("basic", "Architecture Explanation", "", ["Frontend container serves the React application to the browser on port 5173.", "Backend container exposes API endpoints on port 3001 and handles business logic.", "PostgreSQL is the source of truth for records; Adminer is only a viewing and management tool.", "Redis is included to support fast temporary data handling."], ["Frontend", "Backend", "Database"]),
    ("flow", "Process Flow Diagram", "", ["Login", "Review dashboard", "Open logs/alerts", "Acknowledge or resolve", "Create/review incidents", "Check database records"], None),
    ("basic", "Process Flow Explanation", "", ["The analyst logs in using lab credentials and receives access to SOC pages.", "Incoming or simulated events appear as logs and alerts.", "Open alerts can be acknowledged during investigation or resolved after action is complete.", "Database records can be checked in Adminer for verification."], ["Open", "Investigate", "Close"]),
    ("usecase", "Use Case Diagram", "", ["SOC Admin", "Login / Logout", "View dashboard", "Manage alerts", "Investigate incidents", "Change password", "View database"], None),
    ("basic", "Use Case Explanation", "", ["The SOC Admin is the primary user for the lab submission.", "The user can authenticate, monitor threats, inspect logs, manage alerts, and update credentials.", "Adminer is used separately to validate stored records such as users, logs, alerts, and incidents."], ["Admin", "Actions", "Records"]),
    ("database", "Database Design", "", ["Main tables include users, logs, alerts, incidents, rules, ai_analyses, audit_log, log_sources, and dashboard_configs.", "User records include email, password hash, role, and password_changed_at for 15-day rotation tracking.", "Alerts and incidents support operational SOC workflows."], None),
    ("basic", "Screenshots Section", "", ["The following slides describe the important application screens used in the lab demonstration.", "Actual running screens can be opened at the local frontend URL after Docker starts.", "Database screens can be verified through Adminer on port 8080."], ["Login", "Dashboard", "Adminer"]),
    ("ui", "Login and Dashboard UI", "", ["Login portal protects the SOC application.", "Dashboard gives a quick view of live status, alerts, logs, and security operations context.", "Default lab account: admin@siem.local / changeme123"], "login"),
    ("ui", "Logs and Alerts UI", "", ["Logs page shows collected event records.", "Alerts page separates open, acknowledged, resolved, and blocked-threat states.", "Acknowledge means investigation started; resolve means the issue is closed."], "alerts"),
    ("ui", "Incidents and AI Analysis UI", "", ["Incidents organize important alerts into investigation cases.", "AI Analysis page explains suspicious activity when an API key is configured.", "Without a real API key, AI analysis remains offline or demo-only."], "incidents"),
    ("ui", "Settings and Password Rotation UI", "", ["Settings now focuses on access, login/logout, password change, and about project.", "Users can update display name/email and change password after confirming current password.", "The application tracks a 15-day password change cycle."], "settings"),
    ("ui", "Database GUI with Adminer", "", ["Adminer lets the examiner see all database records in the browser.", "Server: postgres; Database: siem_db; Username: siem_user.", "Tables include alerts, logs, users, incidents, rules, and audit_log."], "adminer"),
    ("basic", "Admin Dashboard View", "", ["SOC dashboard summarizes the operational state of the platform.", "It helps demonstrate whether services are live, which threats are active, and what actions have been taken.", "The dashboard is the first screen to show after successful login."], ["Live", "Metrics", "SOC"]),
    ("basic", "Future Enhancements", "", ["Integrate real Wazuh/Elastic log ingestion.", "Add live syslog collectors and stronger correlation rules.", "Enable real AI provider keys with usage controls.", "Add report export, role permissions, and richer incident timelines."], ["Wazuh", "Reports", "Roles"]),
    ("basic", "Conclusion", "", ["The AI SIEM Platform demonstrates core SOC workflows in a working full-stack project.", "Docker makes the lab repeatable, while Adminer makes database evidence easy to show.", "The final system includes authentication, alert workflow, password change, and project documentation."], ["Working", "Repeatable", "Demo Ready"]),
    ("basic", "Bibliography", "", ["Docker documentation", "React and Vite documentation", "Express.js documentation", "PostgreSQL documentation", "Redis documentation", "Wazuh and SIEM concept references", "Project source code and lab guide"], ["Docs", "Sources", "Guide"]),
    ("thanks", "Thank You", "AI SIEM Platform", ["Questions and Demonstration"], None),
]


def wrap_text(text, max_chars=72):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if len(trial) > max_chars and current:
            lines.append(current)
            current = word
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def rect(c, x, y, w, h, fill, stroke=None):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, w, h, 5, fill=1, stroke=1)


def text(c, value, x, y, size=12, color=None, bold=False):
    c.setFillColor(color or C["ink"])
    c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    c.drawString(x, y, value)


def header(c, idx):
    c.setFillColor(C["bg"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    text(c, "SECURITY OPERATIONS CENTER", 36, H - 32, 7.5, C["blue"], True)
    c.setStrokeColor(C["line"])
    c.line(36, H - 46, W - 36, H - 46)
    c.setFillColor(C["soft"])
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - 36, H - 32, f"{idx:02d} / 35")
    text(c, "AI SIEM Platform | Lab Submission", 36, 22, 6.5, C["soft"])


def draw_bullets(c, bullets, x=60, y=260, max_chars=72):
    line_height = 14
    gap = 14
    for i, bullet in enumerate(bullets):
        lines = wrap_text(bullet, max_chars)
        c.setFillColor(C["cyan"] if i % 2 else C["orange"])
        c.circle(x, y + 2, 3, fill=1, stroke=0)
        c.setFillColor(C["ink"])
        c.setFont("Helvetica", 10.2 if len(bullets) > 5 else 11)
        for line in lines[:3]:
            c.drawString(x + 14, y, line)
            y -= line_height
        y -= gap


def visual_cards(c, labels):
    rect(c, 435, 135, 190, 145, C["white"], C["line"])
    for i, label in enumerate(labels[:3]):
        fill = [C["pale_blue"], C["pale_green"], C["pale_orange"]][i]
        stroke = [C["blue"], C["teal"], C["orange"]][i]
        rect(c, 462, 238 - i * 42, 135, 25, fill, stroke)
        c.setFillColor(C["navy"])
        c.setFont("Helvetica-Bold", 8.5)
        c.drawCentredString(529, 247 - i * 42, label)


def draw_architecture(c):
    nodes = [("Browser\nReact UI", 70, 210, C["blue"]), ("Backend API\nNode.js / Express", 230, 210, C["teal"]), ("PostgreSQL\nsiem_db", 410, 250, C["orange"]), ("Redis\nCache", 410, 165, colors.HexColor("#7C3AED")), ("Adminer GUI\nDB Browser", 565, 210, C["cyan"])]
    for label, x, y, col in nodes:
        rect(c, x, y, 95, 45, C["white"], C["line"])
        c.setFillColor(col)
        c.setFont("Helvetica-Bold", 7.5)
        for j, line in enumerate(label.split("\n")):
            c.drawCentredString(x + 47.5, y + 26 - j * 10, line)
    c.setStrokeColor(C["navy"])
    c.setLineWidth(1.5)
    for x1, y1, x2, y2 in [(165, 232, 230, 232), (325, 238, 410, 268), (325, 222, 410, 188), (505, 232, 565, 232)]:
        c.line(x1, y1, x2, y2)


def draw_flow(c):
    steps = ["Login", "Dashboard", "Logs", "Alerts", "Incidents", "Database"]
    x = 58
    for i, step in enumerate(steps):
        rect(c, x, 215, 78, 42, C["white"], C["line"])
        text(c, str(i + 1), x + 8, 235, 11, C["orange"], True)
        text(c, step, x + 24, 235, 8, C["navy"], True)
        if i < len(steps) - 1:
            c.setStrokeColor(C["blue"])
            c.setLineWidth(2)
            c.line(x + 78, 236, x + 105, 236)
        x += 105


def draw_usecase(c):
    rect(c, 65, 160, 85, 130, C["white"], C["line"])
    c.setFillColor(C["navy"])
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(107, 220, "SOC Admin")
    cases = ["Login / Logout", "View Dashboard", "Manage Alerts", "Investigate Incidents", "Change Password", "View Database"]
    for i, case in enumerate(cases):
        x = 220 + (i % 2) * 175
        y = 260 - (i // 2) * 62
        rect(c, x, y, 140, 32, C["white"], C["blue"])
        c.setFillColor(C["ink"])
        c.setFont("Helvetica-Bold", 7.8)
        c.drawCentredString(x + 70, y + 13, case)


def draw_database(c):
    tables = ["users", "logs", "alerts", "incidents", "rules", "ai_analyses", "audit_log", "log_sources", "dashboard_configs"]
    for i, table in enumerate(tables):
        x = 65 + (i % 3) * 170
        y = 255 - (i // 3) * 50
        rect(c, x, y, 130, 28, C["white"], C["line"])
        text(c, table, x + 10, y + 10, 8.5, C["orange"] if i == 0 else C["navy"], True)


def draw_ui(c, mode):
    rect(c, 65, 145, 240, 160, C["dark"], C["dark"])
    c.setFillColor(colors.HexColor("#0F2742"))
    c.rect(65, 282, 240, 23, fill=1, stroke=0)
    text(c, "AI SIEM Login" if mode == "login" else "SOC Platform", 80, 290, 7, C["white"], True)
    if mode == "login":
        rect(c, 145, 245, 80, 18, C["white"], C["line"])
        rect(c, 145, 215, 80, 18, C["white"], C["line"])
        rect(c, 160, 180, 50, 20, C["blue"], C["blue"])
        c.setFillColor(C["white"])
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(185, 187, "Sign In")
    elif mode == "adminer":
        for i, row in enumerate(["users", "alerts", "logs", "incidents", "rules"]):
            text(c, row, 86, 252 - i * 18, 7.5, colors.HexColor("#A9D8FF"))
        c.setFillColor(C["white"])
        c.rect(195, 190, 75, 80, fill=1, stroke=0)
    else:
        for i, col in enumerate([C["blue"], C["orange"], C["teal"]]):
            rect(c, 85 + i * 58, 235, 45, 35, col, col)
        for i in range(4):
            rect(c, 85, 210 - i * 20, 175, 10, colors.HexColor("#19324D"), colors.HexColor("#19324D"))


def render():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H))
    for idx, (kind, title, subtitle, bullets, visual) in enumerate(slides, 1):
        if kind == "cover":
            c.setFillColor(C["bg"])
            c.rect(0, 0, W, H, fill=1, stroke=0)
            c.setFillColor(C["navy"])
            c.rect(0, H - 66, W, 66, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#EDF4FB"))
            c.rect(0, 0, W, 62, fill=1, stroke=0)
            text(c, "PROJECT PRESENTATION", 42, H - 42, 8, colors.HexColor("#A9D8FF"), True)
            text(c, title, 42, 265, 32, C["navy"], True)
            text(c, subtitle, 44, 236, 12, C["soft"])
            draw_bullets(c, bullets, 44, 180, 55)
            rect(c, 450, 140, 150, 150, C["white"], C["line"])
            rect(c, 505, 190, 42, 58, C["blue"], C["blue"])
            c.setFillColor(C["white"])
            c.setFont("Helvetica-Bold", 9)
            c.drawCentredString(526, 215, "SOC")
            text(c, "Submitted for Lab Demonstration", 44, 28, 10.5, C["navy"], True)
        else:
            header(c, idx)
            text(c, title, 36, 322, 20, C["navy"], True)
            if kind == "architecture":
                draw_architecture(c)
                draw_bullets(c, bullets, 60, 105, 85)
            elif kind == "flow":
                draw_flow(c)
                draw_bullets(c, ["Events move from collection to investigation and final verification.", "Each status change is saved so the lab record can be shown later."], 70, 110, 80)
            elif kind == "usecase":
                draw_usecase(c)
            elif kind == "database":
                draw_database(c)
                draw_bullets(c, bullets, 60, 105, 85)
            elif kind == "ui":
                draw_ui(c, visual)
                draw_bullets(c, bullets, 380, 255, 45)
            elif kind == "thanks":
                c.setFillColor(C["navy"])
                c.rect(0, 0, W, H, fill=1, stroke=0)
                rect(c, 55, 55, 610, 290, C["white"], C["line"])
                rect(c, 100, 200, 60, 60, C["pale_blue"], C["line"])
                text(c, "Thank You", 230, 240, 32, C["navy"], True)
                text(c, subtitle, 232, 210, 14, C["blue"], True)
                text(c, bullets[0], 232, 178, 12, C["soft"])
            else:
                draw_bullets(c, bullets)
                visual_cards(c, visual or ["SIEM", "SOC", "Lab"])
        c.showPage()
    c.save()
    return OUT


if __name__ == "__main__":
    print(render())
