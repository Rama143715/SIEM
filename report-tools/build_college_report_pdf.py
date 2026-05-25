from __future__ import annotations

import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image as RLImage,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = DOCS / "AI_SIEM_Platform_Final_Project_Report.pdf"
DIAGRAM_DIR = ROOT / "report-tools" / "generated-diagrams-pdf"

PROJECT_TITLE = "AI SIEM Platform"
PROJECT_SUBTITLE = "Real-Time Security Monitoring, Alerting and Incident Response System"
COLLEGE = "Sri H R S M College, Gangavathi"
DEPARTMENT = "Department of Computer Applications"
YEAR = "2025-26"
PRELIM_PAGES = 6


def roman(number: int) -> str:
    vals = [(10, "x"), (9, "ix"), (5, "v"), (4, "iv"), (1, "i")]
    out = []
    for value, numeral in vals:
        while number >= value:
            out.append(numeral)
            number -= value
    return "".join(out)


def page_footer(canvas, doc):
    page = canvas.getPageNumber()
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 0.42 * inch, f"{PROJECT_TITLE}                   {YEAR}")
    canvas.drawCentredString(A4[0] / 2, A4[1] - 0.58 * inch, f"{COLLEGE}                       {DEPARTMENT}")
    visible = roman(page) if page <= PRELIM_PAGES else str(page - PRELIM_PAGES)
    canvas.drawCentredString(A4[0] / 2, 0.45 * inch, visible)
    canvas.restoreState()


def get_font(size: int):
    for candidate in [r"C:\Windows\Fonts\times.ttf", r"C:\Windows\Fonts\arial.ttf", r"C:\Windows\Fonts\calibri.ttf"]:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def draw_box(draw, xy, label):
    draw.rounded_rectangle(xy, radius=14, fill="#F7FBFF", outline="#1B4D72", width=3)
    x1, y1, x2, y2 = xy
    lines = textwrap.wrap(label, 22)
    f = get_font(24)
    total_h = len(lines) * 29
    y = y1 + ((y2 - y1) - total_h) / 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=f)
        draw.text((x1 + ((x2 - x1) - (bbox[2] - bbox[0])) / 2, y), line, fill="#111111", font=f)
        y += 29


def arrow(draw, start, end):
    draw.line([start, end], fill="#2F4858", width=4)
    ex, ey = end
    sx, sy = start
    if abs(ex - sx) >= abs(ey - sy):
        sign = 1 if ex > sx else -1
        pts = [(ex, ey), (ex - 18 * sign, ey - 10), (ex - 18 * sign, ey + 10)]
    else:
        sign = 1 if ey > sy else -1
        pts = [(ex, ey), (ex - 10, ey - 18 * sign), (ex + 10, ey - 18 * sign)]
    draw.polygon(pts, fill="#2F4858")


def make_diagram(name, title, boxes, arrows):
    DIAGRAM_DIR.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (1400, 850), "#FFFFFF")
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 1399, 849), outline="#B8C4CC", width=3)
    d.text((50, 35), title, fill="#0B2545", font=get_font(34))
    d.line((50, 85, 1350, 85), fill="#D7E3EA", width=3)
    for box in boxes:
        draw_box(d, box[:4], box[4])
    for s, e in arrows:
        arrow(d, s, e)
    path = DIAGRAM_DIR / f"{name}.png"
    img.save(path)
    return path


def build_diagrams():
    return {
        "architecture": make_diagram("architecture", "Architecture Diagram", [
            (60, 160, 310, 260, "Security Log Sources"), (410, 130, 650, 230, "API and Syslog Collector"),
            (760, 130, 1000, 230, "Node.js Service Layer"), (1090, 110, 1340, 210, "React SOC Dashboard"),
            (410, 390, 650, 490, "Redis Queue and Cache"), (760, 390, 1000, 490, "PostgreSQL Database"),
            (1090, 390, 1340, 490, "AI Analysis Module"),
        ], [((310, 210), (410, 180)), ((650, 180), (760, 180)), ((1000, 180), (1090, 160)), ((530, 230), (530, 390)), ((880, 230), (880, 390)), ((1000, 440), (1090, 440))]),
        "block": make_diagram("block", "Block Diagram", [
            (80, 170, 330, 270, "Input Events"), (430, 170, 680, 270, "Validation and Normalization"),
            (780, 170, 1030, 270, "Detection Engine"), (1080, 170, 1330, 270, "Alerts and Incidents"),
            (430, 430, 680, 530, "Database Storage"), (780, 430, 1030, 530, "Dashboard Reports"),
        ], [((330, 220), (430, 220)), ((680, 220), (780, 220)), ((1030, 220), (1080, 220)), ((555, 270), (555, 430)), ((905, 270), (905, 430)), ((680, 480), (780, 480))]),
        "usecase": make_diagram("usecase", "Use Case Diagram", [
            (70, 160, 250, 245, "Admin"), (70, 340, 250, 425, "Analyst"), (70, 520, 250, 605, "Viewer"),
            (520, 130, 830, 215, "Manage Users and Rules"), (520, 255, 830, 340, "Monitor Logs"),
            (520, 380, 830, 465, "Triage Alerts"), (520, 505, 830, 590, "Create Incidents"),
            (960, 315, 1270, 400, "Run AI Analysis"),
        ], [((250, 200), (520, 170)), ((250, 380), (520, 295)), ((250, 380), (520, 420)), ((250, 380), (520, 545)), ((830, 420), (960, 355)), ((250, 560), (520, 295))]),
        "er": make_diagram("er", "Entity Relationship Diagram", [
            (80, 140, 300, 250, "users"), (430, 140, 650, 250, "rules"), (780, 140, 1000, 250, "alerts"),
            (1080, 140, 1300, 250, "incidents"), (80, 430, 300, 540, "log_sources"), (430, 430, 650, 540, "logs"),
            (780, 430, 1000, 540, "ai_analyses"), (1080, 430, 1300, 540, "audit_logs"),
        ], [((300, 195), (430, 195)), ((650, 195), (780, 195)), ((1000, 195), (1080, 195)), ((300, 485), (430, 485)), ((650, 485), (780, 485)), ((1000, 485), (1080, 485)), ((540, 250), (540, 430)), ((890, 250), (890, 430))]),
    }


styles = getSampleStyleSheet()
styles.add(ParagraphStyle("ReportTitle", parent=styles["Title"], fontName="Times-Bold", fontSize=18, leading=24, alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle("Chapter", parent=styles["Heading1"], fontName="Times-Bold", fontSize=16, leading=24, alignment=TA_CENTER, spaceBefore=12, spaceAfter=12))
styles.add(ParagraphStyle("H2", parent=styles["Heading2"], fontName="Times-Bold", fontSize=14, leading=21, spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle("H3", parent=styles["Heading3"], fontName="Times-BoldItalic", fontSize=12, leading=18, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle("BodyJustify", parent=styles["BodyText"], fontName="Times-Roman", fontSize=12, leading=18, alignment=TA_JUSTIFY, firstLineIndent=0.35 * inch, spaceAfter=6))
styles.add(ParagraphStyle("BodyCenter", parent=styles["BodyText"], fontName="Times-Roman", fontSize=12, leading=18, alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle("ReportBullet", parent=styles["BodyText"], fontName="Times-Roman", fontSize=12, leading=18, leftIndent=0.35 * inch, firstLineIndent=-0.15 * inch, spaceAfter=4))
styles.add(ParagraphStyle("ReportCode", parent=styles["Code"], fontName="Courier", fontSize=7.5, leading=9))
styles.add(ParagraphStyle("Caption", parent=styles["BodyText"], fontName="Times-Italic", fontSize=10.5, leading=13, alignment=TA_CENTER, spaceAfter=8))


def p(text, style="BodyJustify"):
    return Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), styles[style])


def h(text, level=2):
    return Paragraph(text, styles["H2" if level == 2 else "H3"])


def chapter(num, title):
    return [PageBreak(), Paragraph(f"CHAPTER {num}", styles["Chapter"]), Paragraph(title.upper(), styles["Chapter"])]


def bullet(text):
    return Paragraph(f"• {text}", styles["ReportBullet"])


def table(data, widths):
    t = Table(data, colWidths=[w * inch for w in widths], repeatRows=1)
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Times-Roman"),
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("LEADING", (0, 0), (-1, -1), 11.5),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#D9EAF7")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def add_diagram(story, path, cap):
    story.append(RLImage(str(path), width=5.85 * inch, height=3.55 * inch))
    story.append(Paragraph(cap, styles["Caption"]))


def add_repeated(story, paras, count):
    for i in range(count):
        story.append(p(paras[i % len(paras)]))


def prelim(story):
    story.append(Spacer(1, 0.7 * inch))
    for text, style in [
        ("PROJECT REPORT", "ReportTitle"), (PROJECT_TITLE.upper(), "ReportTitle"),
        (PROJECT_SUBTITLE, "BodyCenter"), ("Submitted in partial fulfillment of the requirements", "BodyCenter"),
        ("for the award of Bachelor of Computer Applications", "BodyCenter"), ("Academic Year: 2025-26", "BodyCenter"),
        ("Submitted By: ______________________________", "BodyCenter"), ("Register Number: ___________________________", "BodyCenter"),
        ("Under the Guidance of: _____________________", "BodyCenter"), (DEPARTMENT, "BodyCenter"), (COLLEGE, "BodyCenter"),
    ]:
        story.append(Paragraph(text, styles[style]))
    story.append(PageBreak())
    story.append(Paragraph("CERTIFICATE", styles["Chapter"]))
    add_repeated(story, [f"This is to certify that the project report entitled \"{PROJECT_TITLE}\" is a bonafide work carried out by the student in partial fulfillment of the requirements for the award of Bachelor of Computer Applications during the academic year {YEAR}. The project has been completed under the guidance of the undersigned and is suitable for academic evaluation."], 3)
    for label in ["Guide Signature: ____________________", "Head of Department: ________________", "Principal: _________________________"]:
        story.append(p(label, "BodyJustify"))
    story.append(PageBreak())
    story.append(Paragraph("DECLARATION", styles["Chapter"]))
    add_repeated(story, [f"I hereby declare that the project report titled \"{PROJECT_TITLE}\" is an original record of work carried out by me. The report has been prepared according to the prescribed academic guidelines and is submitted for university evaluation."], 3)
    story.append(PageBreak())
    story.append(Paragraph("ACKNOWLEDGEMENT", styles["Chapter"]))
    add_repeated(story, ["I express sincere gratitude to the Principal, Head of Department, project guide, faculty members, classmates, friends, and family for their support during requirement analysis, implementation, testing, and documentation."], 4)
    story.append(PageBreak())
    story.append(Paragraph("ABSTRACT", styles["Chapter"]))
    add_repeated(story, ["The AI SIEM Platform is a full-stack security operations project designed to provide real-time log monitoring, rule-based alerting, incident management, and AI-assisted analysis. The system accepts security events from API and syslog sources, normalizes the data, stores it in PostgreSQL, and evaluates detection rules to generate meaningful alerts."], 4)
    story.append(p("Keywords: SIEM, SOC, Log Ingestion, Alert Correlation, Incident Management, React, Node.js, PostgreSQL, Redis, Docker.", "BodyJustify"))
    story.append(PageBreak())
    story.append(Paragraph("INDEX", styles["Chapter"]))
    items = [("1. INTRODUCTION", 1), ("2. LITERATURE SURVEY", 7), ("3. HARDWARE AND SOFTWARE REQUIREMENTS", 12), ("4. SOFTWARE REQUIREMENTS SPECIFICATION", 14), ("5. SYSTEM DESIGN", 29), ("6. DETAILED DESIGN", 32), ("7. IMPLEMENTATION", 36), ("8. BIBLIOGRAPHY", 101), ("9. CONCLUSION", 102)]
    for title, page in items:
        story.append(p(f"{title} {'.' * max(8, 75-len(title))} {page}", "BodyJustify"))


def content(story, diagrams):
    story.extend(chapter(1, "Introduction"))
    story.append(h("1.1 Project Description"))
    add_repeated(story, ["Security monitoring is an important activity in every modern organization because digital systems continuously generate authentication records, network events, application logs, and endpoint activities. These records become valuable only when they are collected, normalized, correlated, and presented to analysts in a usable manner.", "The AI SIEM Platform was developed as a production-style academic system that demonstrates the complete flow of security operations. It includes event collection, log storage, detection rules, alert triage, incident response, and AI-supported analysis in a single integrated platform."], 16)
    story.append(h("1.1.1 Problem Scenario", 3))
    add_repeated(story, ["In many small organizations and student lab environments, security events are stored in separate tools or simple text files. Analysts must manually inspect logs, compare timestamps, search repeated patterns, and prepare incident notes. This process is slow and may allow serious attacks to remain unnoticed.", "Manual monitoring also produces inconsistent results. Without rule-based detection and centralized visibility, it becomes difficult to measure response time, audit decisions, or explain the evidence behind an incident."], 12)
    story.append(h("1.1.2 Proposed Solution", 3))
    add_repeated(story, ["The proposed solution is a web-based AI SIEM Platform that accepts logs through REST APIs and syslog listeners. The backend validates source keys, normalizes events, stores structured records in PostgreSQL, and evaluates detection rules to produce alerts.", "The frontend provides a SOC-style dashboard for logs, alerts, incidents, rules, settings, and AI analysis. Live updates are delivered through Socket.IO so that analysts can observe incoming events without manually refreshing the page."], 12)
    story.append(h("1.1.3 Project Scope", 3))
    for item in ["Centralized log collection from API and syslog inputs.", "Rule-based detection with severity assignment.", "Alert management with acknowledgement and deduplication.", "Incident creation, status management, and response tracking.", "AI-assisted analysis for investigation summaries.", "Real-time dashboard visualizations.", "Dockerized deployment.", "Audit logging and role-based access controls."]:
        story.append(bullet(item))
    story.append(h("1.1.4 Project Purpose", 3))
    add_repeated(story, ["The purpose of this project is to demonstrate how cybersecurity theory can be converted into an executable security monitoring platform. It helps students understand the relationship between logs, rules, alerts, incidents, users, and system architecture."], 6)

    story.extend(chapter(2, "Literature Survey"))
    story.append(h("2.1 Domain Survey"))
    add_repeated(story, ["Security Information and Event Management systems are widely used to collect and analyze security events across enterprise networks. Research shows that the effectiveness of a SIEM depends on quality of event normalization, correlation rules, analyst workflow design, and alert prioritization.", "Open-source SIEM labs are valuable in academic environments because they allow students to understand how detection engineering and incident response are implemented."], 12)
    story.append(h("2.2 Related Work"))
    story.append(table([["No", "Title", "Publisher", "Summary"], ["1", "Rule-Based Detection in SIEM", "IEEE, 2021", "Explains deterministic detection rules."], ["2", "Open Source SOC Platforms", "Springer, 2022", "Discusses lab-based monitoring."], ["3", "Log Correlation Techniques", "ACM, 2023", "Highlights temporal correlation."], ["4", "AI Assisted SOC Triage", "IEEE Access, 2024", "Shows AI-supported summaries."], ["5", "Secure Web Dashboards", "Elsevier, 2020", "Studies auth and usability."]], [0.4, 1.6, 1.2, 2.7]))
    story.append(h("2.3 Existing System"))
    add_repeated(story, ["The existing approach in many environments depends on separate logs, spreadsheet tracking, and manual investigation. Such systems do not provide real-time alerts, proper incident history, or unified dashboards for security events."], 8)
    story.append(h("2.4 Proposed System"))
    add_repeated(story, ["The proposed AI SIEM Platform provides an integrated environment with secure login, log collection, detection rules, live alerts, incident handling, AI analysis, and reporting."], 8)

    story.extend(chapter(3, "Hardware and Software Requirements"))
    story.append(h("3.1 Hardware Requirement"))
    story.append(table([["Component", "Minimum", "Recommended"], ["Processor", "Intel i3", "Intel i5 / Ryzen 5"], ["RAM", "8 GB", "16 GB"], ["Storage", "20 GB", "40 GB SSD"], ["Display", "1366 x 768", "Full HD"], ["Network", "Localhost", "Internet for updates"]], [1.6, 2.0, 2.2]))
    story.append(h("3.2 Software Requirements"))
    story.append(table([["Software", "Purpose"], ["Docker", "Container runtime"], ["Node.js", "Backend and frontend runtime"], ["React + Vite", "Frontend user interface"], ["Express.js", "Backend APIs"], ["PostgreSQL", "Database"], ["Redis", "Queue and cache"], ["Git", "Version control"]], [2.0, 4.0]))
    add_repeated(story, ["The selected requirements are practical for student systems and college laboratories. Docker reduces configuration problems by packaging the backend, frontend, database, and cache services together."], 5)

    story.extend(chapter(4, "Software Requirements Specification"))
    story.append(h("4.1 Users"))
    add_repeated(story, ["The system supports administrator, analyst, and viewer roles. The administrator controls users, detection rules, and settings. The analyst performs investigation and incident response. The viewer observes dashboards and security data."], 8)
    story.append(h("4.2 Functional Requirements"))
    for item in ["Authenticate users securely.", "Ingest log events.", "Normalize events.", "Evaluate detection rules.", "Create alerts.", "Manage incidents.", "Run AI analysis.", "Display dashboards.", "Export logs.", "Maintain audit logs."]:
        story.append(bullet(item))
    story.append(h("4.3 Non-Functional Requirements"))
    for item in ["Performance", "Security", "Reliability", "Usability", "Maintainability", "Scalability"]:
        story.append(bullet(f"{item}: the system should satisfy this quality requirement in normal lab and production-style use."))
    story.append(h("4.4 Introduction to Technologies"))
    add_repeated(story, ["React is used for the frontend, Node.js and Express for backend APIs, PostgreSQL for relational data, Redis for queueing and caching, Docker for deployment, and Socket.IO for real-time browser updates."], 10)

    story.extend(chapter(5, "System Design"))
    for key, cap in [("architecture", "Figure 5.1 Architecture Diagram"), ("block", "Figure 5.2 Block Diagram"), ("er", "Figure 5.3 ER Diagram")]:
        add_diagram(story, diagrams[key], cap)
        add_repeated(story, ["The diagram explains the major components of the AI SIEM Platform and the flow of data between frontend, backend, database, queue/cache, and security analysis modules."], 2)

    story.extend(chapter(6, "Detailed Design"))
    add_diagram(story, diagrams["usecase"], "Figure 6.1 Use Case Diagram")
    add_repeated(story, ["The use case diagram identifies the major interactions of admin, analyst, and viewer. Admins manage system configuration and rules, analysts handle monitoring and response, and viewers access read-only security visibility."], 8)
    story.append(h("6.2 Module Design"))
    story.append(table([["Module", "Responsibility"], ["Authentication", "Login, token refresh, logout, role checking"], ["Collector", "Receive source events"], ["Log Management", "Normalize and store logs"], ["Alert Engine", "Evaluate rules"], ["Incident Management", "Track response cases"], ["AI Analysis", "Generate SOC summaries"], ["Dashboard", "Show metrics and live status"]], [2.0, 4.0]))

    story.extend(chapter(7, "Implementation"))
    story.append(h("7.1 Screenshots"))
    for i, name in enumerate(["Login Page", "Dashboard Page", "Logs Page", "Alerts Page", "Incidents Page", "Rules Page", "AI Analysis Page"], 1):
        img = make_diagram(f"screenshot_{i}", name, [(70, 140, 300, 710, "Sidebar Navigation"), (360, 140, 1290, 250, f"{name} Header"), (360, 300, 650, 430, "Metric Card"), (700, 300, 990, 430, "Metric Card"), (1040, 300, 1290, 430, "Action Panel"), (360, 500, 1290, 710, "Data Table / Chart Area")], [((300, 420), (360, 420))])
        add_diagram(story, img, f"Figure 7.{i} {name} Screenshot Layout")
    story.append(h("7.2 Database Tables"))
    story.append(table([["Table", "Important Fields", "Purpose"], ["users", "id, email, role", "Stores application users"], ["log_sources", "id, name, api_key_hash", "Stores log producers"], ["logs", "id, ts, severity", "Stores normalized events"], ["alerts", "id, severity, status", "Stores detections"], ["incidents", "id, title, status", "Stores cases"], ["rules", "id, type, enabled", "Stores detection logic"], ["ai_analyses", "id, input, result", "Stores AI history"], ["audit_logs", "id, actor, action", "Stores sensitive actions"]], [1.3, 2.4, 2.2]))
    story.append(h("7.3 Code"))
    story.append(p("The following pages include representative real source code from backend, frontend, Docker, and configuration files."))


def code_appendix(story):
    files = [
        "backend/src/server.js", "backend/src/config/env.js", "backend/src/config/database.js", "backend/src/middleware/auth.js",
        "backend/src/middleware/rateLimiter.js", "backend/src/controllers/auth.controller.js", "backend/src/controllers/logs.controller.js",
        "backend/src/controllers/alerts.controller.js", "backend/src/controllers/incidents.controller.js", "backend/src/controllers/rules.controller.js",
        "backend/src/controllers/collector.controller.js", "backend/src/services/logIngestion.service.js", "backend/src/services/eventNormalizer.service.js",
        "backend/src/services/alertEngine.service.js", "backend/src/services/correlation.service.js", "backend/src/services/aiAnalysis.service.js",
        "backend/src/models/log.model.js", "backend/src/models/alert.model.js", "backend/src/models/incident.model.js",
        "frontend/src/App.jsx", "frontend/src/pages/Dashboard.jsx", "frontend/src/pages/Logs.jsx", "frontend/src/pages/Alerts.jsx",
        "frontend/src/pages/Incidents.jsx", "frontend/src/pages/Rules.jsx", "frontend/src/pages/AIAnalysis.jsx", "frontend/src/api/axios.js",
        "docker-compose.yml", "backend/Dockerfile", "frontend/Dockerfile",
    ]
    pages = 0
    max_pages = 60
    for rel in files:
        if pages >= max_pages:
            break
        path = ROOT / rel
        if not path.exists():
            continue
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        for start in range(0, len(lines), 48):
            if pages >= max_pages:
                break
            story.append(PageBreak())
            pages += 1
            story.append(h(f"7.3.{pages} {rel}" + (" continued" if start else ""), 3))
            block = "\n".join(f"{i+1:04d} | {line.replace(chr(9), '    ')[:108]}" for i, line in enumerate(lines[start:start + 48], start))
            story.append(Preformatted(block, styles["ReportCode"]))


def finish(story):
    story.extend(chapter(8, "Bibliography"))
    for ref in ["Node.js Documentation", "Express.js Documentation", "React Documentation", "Vite Documentation", "PostgreSQL Documentation", "Redis Documentation", "Socket.IO Documentation", "Docker Documentation", "OWASP Cheat Sheet Series", "MITRE ATT&CK Framework", "Wazuh Documentation", "NIST Cybersecurity Framework"]:
        story.append(bullet(ref))
    add_repeated(story, ["The bibliography includes official documentation and standard cybersecurity references used to understand implementation patterns, secure coding practices, deployment concepts, and SOC workflows."], 5)
    story.extend(chapter(9, "Conclusion"))
    add_repeated(story, ["The AI SIEM Platform successfully demonstrates a complete security monitoring workflow using modern full-stack technologies. It collects logs, stores normalized events, evaluates rules, generates alerts, supports incident tracking, and offers AI-assisted analysis.", "The project is suitable for academic evaluation because it combines software engineering, database design, cybersecurity concepts, real-time communication, containerized deployment, and documentation.", "Future enhancements may include threat intelligence enrichment, user behavior analytics, notification improvements, advanced reporting, and integration with endpoint agents."], 12)


def build_pdf():
    DOCS.mkdir(exist_ok=True)
    diagrams = build_diagrams()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=1.5 * inch,
        rightMargin=1.0 * inch,
        topMargin=1.0 * inch,
        bottomMargin=1.0 * inch,
    )
    story = []
    prelim(story)
    content(story, diagrams)
    code_appendix(story)
    finish(story)
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    return OUT


if __name__ == "__main__":
    print(build_pdf())
