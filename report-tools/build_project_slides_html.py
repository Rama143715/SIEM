from html import escape
from pathlib import Path

from build_project_slides_pdf import slides


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "AI_SIEM_Platform_Project_Presentation_OPEN_IN_BROWSER.html"


def card_labels(visual):
    if isinstance(visual, list):
        return visual[:3]
    if visual == "login":
        return ["Login", "Dashboard", "Access"]
    if visual == "adminer":
        return ["Adminer", "Tables", "Records"]
    if visual:
        return ["SOC UI", "Alerts", "Records"]
    return ["SIEM", "SOC", "Lab"]


def diagram(kind, visual):
    if kind == "architecture":
        return """
        <div class="diagram arch">
          <div>Browser<br><b>React UI</b></div><span></span>
          <div>Backend API<br><b>Node.js</b></div><span></span>
          <div>PostgreSQL<br><b>siem_db</b></div>
          <div class="small">Redis<br><b>Cache</b></div>
          <div class="small">Adminer<br><b>DB GUI</b></div>
        </div>
        """
    if kind == "flow":
        steps = ["Login", "Dashboard", "Logs", "Alerts", "Incidents", "Database"]
        return '<div class="diagram flow">' + "".join(f"<div><b>{i+1}</b><br>{escape(s)}</div>" for i, s in enumerate(steps)) + "</div>"
    if kind == "usecase":
        cases = ["Login / Logout", "View Dashboard", "Manage Alerts", "Investigate Incidents", "Change Password", "View Database"]
        return '<div class="diagram usecase"><div class="actor">SOC<br>Admin</div>' + "".join(f"<div>{escape(c)}</div>" for c in cases) + "</div>"
    if kind == "database":
        tables = ["users", "logs", "alerts", "incidents", "rules", "ai_analyses", "audit_log", "log_sources", "dashboard_configs"]
        return '<div class="diagram database">' + "".join(f"<div>{escape(t)}</div>" for t in tables) + "</div>"
    if kind == "ui":
        title = "AI SIEM Login" if visual == "login" else "SOC Platform"
        rows = "".join("<i></i>" for _ in range(4))
        return f'<div class="mock"><header>{escape(title)}</header><section><b></b><b></b><b></b>{rows}</section></div>'
    labels = card_labels(visual)
    return '<div class="cards">' + "".join(f"<div>{escape(x)}</div>" for x in labels) + "</div>"


def build():
    sections = []
    for idx, (kind, title, subtitle, bullets, visual) in enumerate(slides, 1):
        if kind == "cover":
            sections.append(f"""
            <section class="slide cover">
              <div class="topbar">PROJECT PRESENTATION</div>
              <main>
                <div>
                  <h1>{escape(title)}</h1>
                  <h2>{escape(subtitle)}</h2>
                  <ul>{''.join(f'<li>{escape(b)}</li>' for b in bullets)}</ul>
                </div>
                <div class="shield"><strong>SOC</strong><span>Monitor Detect Respond</span></div>
              </main>
              <footer>Submitted for Lab Demonstration</footer>
            </section>
            """)
        elif kind == "thanks":
            sections.append(f"""
            <section class="slide thanks">
              <div class="thanksbox">
                <div class="shield mini"><strong>SOC</strong></div>
                <h1>{escape(title)}</h1>
                <h2>{escape(subtitle)}</h2>
                <p>{escape(bullets[0])}</p>
              </div>
              <small>{idx:02d} / 35</small>
            </section>
            """)
        else:
            sections.append(f"""
            <section class="slide">
              <header><b>SECURITY OPERATIONS CENTER</b><span>{idx:02d} / 35</span></header>
              <h1>{escape(title)}</h1>
              <div class="content">
                <ul>{''.join(f'<li>{escape(b)}</li>' for b in bullets)}</ul>
                {diagram(kind, visual)}
              </div>
              <footer>AI SIEM Platform | Lab Submission</footer>
            </section>
            """)

    html = f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI SIEM Platform Project Presentation</title>
  <style>
    @page {{ size: 16in 9in; margin: 0; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: #dfe6ef; font-family: Aptos, Arial, sans-serif; color: #14213d; }}
    .slide {{ width: 16in; height: 9in; margin: 0 auto 24px; padding: .62in .82in; background: #f7f8fc; position: relative; page-break-after: always; overflow: hidden; }}
    .slide header {{ display: flex; justify-content: space-between; border-bottom: 1px solid #d8e0ea; padding-bottom: .16in; font-size: 13px; color: #1557b0; letter-spacing: .04em; }}
    .slide header span {{ color: #64748b; font-weight: 700; }}
    h1 {{ margin: .45in 0 .34in; font-size: 38px; line-height: 1.05; color: #0a2342; }}
    h2 {{ font-size: 22px; color: #64748b; font-weight: 400; margin: .18in 0 .6in; }}
    ul {{ margin: 0; padding: 0; list-style: none; }}
    li {{ font-size: 20px; line-height: 1.34; margin: 0 0 .22in; position: relative; padding-left: .28in; }}
    li::before {{ content: ""; width: .09in; height: .09in; border-radius: 50%; background: #b45a1c; position: absolute; left: 0; top: .13in; }}
    li:nth-child(even)::before {{ background: #1aa6d9; }}
    .content {{ display: grid; grid-template-columns: 1.35fr .95fr; gap: .65in; align-items: start; }}
    footer {{ position: absolute; left: .82in; bottom: .34in; color: #64748b; font-size: 12px; }}
    .cards {{ background: white; border: 1px solid #d8e0ea; border-radius: 8px; padding: .45in; min-height: 3.2in; display: grid; gap: .25in; align-content: center; }}
    .cards div {{ border: 1px solid #1557b0; background: #edf6ff; border-radius: 6px; padding: .18in; text-align: center; font-weight: 700; }}
    .cards div:nth-child(2) {{ border-color: #0e8f7c; background: #f0fdf4; }}
    .cards div:nth-child(3) {{ border-color: #b45a1c; background: #fff7ed; }}
    .diagram {{ background: white; border: 1px solid #d8e0ea; border-radius: 8px; padding: .35in; min-height: 3.2in; }}
    .arch {{ display: grid; grid-template-columns: 1fr .25fr 1fr .25fr 1fr; gap: .15in; align-items: center; text-align: center; }}
    .arch div, .flow div, .usecase div, .database div {{ border: 1px solid #d8e0ea; border-radius: 7px; background: white; padding: .16in; font-size: 15px; }}
    .arch span {{ height: 3px; background: #1557b0; display: block; }}
    .flow {{ display: grid; grid-template-columns: repeat(6, 1fr); gap: .11in; text-align: center; align-items: center; }}
    .usecase, .database {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: .15in; text-align: center; }}
    .usecase .actor {{ grid-row: span 2; background: #edf6ff; font-weight: 700; }}
    .mock {{ background: #06111f; border-radius: 8px; padding: .22in; min-height: 3.2in; }}
    .mock header {{ color: white; border: none; padding: 0 0 .22in; display: block; }}
    .mock b {{ display: inline-block; width: 1.05in; height: .55in; background: #1557b0; margin-right: .16in; border-radius: 5px; }}
    .mock b:nth-child(2) {{ background: #b45a1c; }}
    .mock b:nth-child(3) {{ background: #0e8f7c; }}
    .mock i {{ display: block; height: .18in; background: #19324d; margin: .18in 0; border-radius: 4px; }}
    .cover {{ padding: 0; }}
    .cover .topbar {{ height: 1.25in; background: #0a2342; color: #a9d8ff; padding: .65in .85in 0; font-weight: 700; letter-spacing: .05em; }}
    .cover main {{ padding: .9in .85in; display: grid; grid-template-columns: 1.3fr .8fr; gap: .7in; }}
    .cover h1 {{ font-size: 54px; margin: 0 0 .18in; }}
    .cover footer {{ background: #edf4fb; left: 0; right: 0; bottom: 0; height: .82in; padding: .28in .85in; font-size: 18px; color: #0a2342; font-weight: 700; }}
    .shield {{ background: white; border: 1px solid #d8e0ea; border-radius: 8px; min-height: 3.1in; display: grid; place-items: center; text-align: center; }}
    .shield strong {{ background: #1557b0; color: white; padding: .35in .28in; border-radius: 8px; }}
    .shield span {{ display: block; color: #64748b; margin-top: .35in; }}
    .thanks {{ background: #0a2342; display: grid; place-items: center; }}
    .thanksbox {{ width: 12.3in; height: 5.9in; background: white; border-radius: 8px; padding: 1.3in 1.6in; }}
    .thanks small {{ position: absolute; right: 1in; bottom: .8in; color: #64748b; }}
    @media print {{ body {{ background: white; }} .slide {{ margin: 0; }} }}
  </style>
</head>
<body>
{''.join(sections)}
</body>
</html>"""
    OUT.write_text(html, encoding="utf-8")
    return OUT


if __name__ == "__main__":
    print(build())
