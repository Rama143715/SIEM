INSERT INTO log_sources (name, type, ip_address, api_key, is_active)
VALUES (
  'real-world-collector',
  'collector',
  NULL,
  encode(digest('real_collector_key', 'sha256'), 'hex'),
  true
)
ON CONFLICT (api_key) DO NOTHING;

INSERT INTO rules (name, description, severity, type, conditions, actions, is_enabled, mitre_tactic, mitre_tech, created_by)
VALUES
(
  'Wazuh Credential Dumping Alert',
  'Detect Wazuh or EDR alerts that reference credential dumping tools and LSASS access.',
  'CRITICAL',
  'regex',
  '{"pattern":"(mimikatz|sekurlsa|lsass|credential dumping|procdump.*lsass)"}',
  '[{"type":"create_alert"}]',
  true,
  'Credential Access',
  'T1003',
  NULL
),
(
  'Windows Failed Logon Burst',
  'Detect repeated Windows failed logon events from the same source or user.',
  'HIGH',
  'threshold',
  '{"field":"message","operator":"regex","value":"(Windows event 4625|failed logon|failed to log on|account failed to log on|logon failure|failed login)","threshold":8,"timeWindowSeconds":300}',
  '[{"type":"create_alert"}]',
  true,
  'Credential Access',
  'T1110',
  NULL
),
(
  'Suspicious PowerShell Command Line',
  'Detect encoded or download cradle PowerShell execution commonly seen in intrusion activity.',
  'HIGH',
  'regex',
  '{"pattern":"(powershell.*-enc|encodedcommand|downloadstring|iex\\s*\\(|invoke-webrequest|invoke-expression)"}',
  '[{"type":"create_alert"}]',
  true,
  'Execution',
  'T1059.001',
  NULL
),
(
  'Suricata High Confidence Network Alert',
  'Detect Suricata EVE alerts with high-confidence exploit, malware, C2, or credential attack signatures.',
  'HIGH',
  'regex',
  '{"pattern":"(ET\\s+(MALWARE|TROJAN|EXPLOIT|CNC)|command and control|C2|SQL Injection|Possible Credential)"}',
  '[{"type":"create_alert"}]',
  true,
  'Command and Control',
  'T1071',
  NULL
)
ON CONFLICT (name) DO NOTHING;
