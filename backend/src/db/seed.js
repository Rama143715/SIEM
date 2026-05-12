const bcrypt = require("bcrypt");
const db = require("../config/database");
const { hashApiKey } = require("../models/logSource.model");

async function seedAdmin() {
  const email = "admin@siem.local";
  const password = "changeme123";
  const hash = await bcrypt.hash(password, 12);

  await db.query(`
    INSERT INTO users (email, password, full_name, role, is_active)
    VALUES ($1, $2, $3, 'admin', true)
    ON CONFLICT (email) DO NOTHING
  `, [email, hash, "SIEM Admin"]);
}

async function seedSources() {
  const sources = [
    { name: "firewall-main", type: "firewall", ip: "10.0.0.10", key: "firewall_demo_key" },
    { name: "endpoint-edr", type: "endpoint", ip: "10.0.0.20", key: "endpoint_demo_key" },
  ];

  for (const source of sources) {
    await db.query(`
      INSERT INTO log_sources (name, type, ip_address, api_key, is_active)
      VALUES ($1,$2,$3,$4,true)
      ON CONFLICT (api_key) DO NOTHING
    `, [source.name, source.type, source.ip, hashApiKey(source.key)]);
  }
}

async function seedRules() {
  const templates = [
    {
      name: "Brute Force Login Attempts",
      description: "Detect repeated failed logins from same source",
      severity: "HIGH",
      type: "threshold",
      conditions: { field: "message", operator: "contains", value: "failed login", threshold: 10, timeWindowSeconds: 60 },
      actions: [{ type: "create_alert" }],
      mitre_tactic: "Credential Access",
      mitre_tech: "T1110",
    },
    {
      name: "SQL Injection Pattern",
      description: "Detect SQLi indicators in logs",
      severity: "CRITICAL",
      type: "regex",
      conditions: { pattern: "(union\\s+select|or\\s+1=1|sleep\\()" },
      actions: [{ type: "create_alert" }],
      mitre_tactic: "Initial Access",
      mitre_tech: "T1190",
    },
  ];

  const { rows } = await db.query("SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1");
  const adminId = rows[0]?.id || null;

  for (const template of templates) {
    await db.query(`
      INSERT INTO rules (name, description, severity, type, conditions, actions, is_enabled, mitre_tactic, mitre_tech, created_by)
      VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,true,$7,$8,$9)
      ON CONFLICT DO NOTHING
    `, [
      template.name,
      template.description,
      template.severity,
      template.type,
      JSON.stringify(template.conditions),
      JSON.stringify(template.actions),
      template.mitre_tactic,
      template.mitre_tech,
      adminId,
    ]);
  }
}

async function run() {
  await seedAdmin();
  await seedSources();
  await seedRules();

  console.log("Seeding complete.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});