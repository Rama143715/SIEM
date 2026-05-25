param(
  [string]$BaseUrl = "http://localhost:3001",
  [string]$Email = "admin@siem.local",
  [string]$Password = "changeme123",
  [string]$SourceApiKey = "firewall_demo_key"
)

$ErrorActionPreference = "Stop"

function Invoke-SiemApi {
  param(
    [ValidateSet("GET", "POST", "PATCH", "PUT", "DELETE")]
    [string]$Method,
    [string]$Path,
    [object]$Body = $null,
    [string]$Token = ""
  )

  $headers = @{}
  if ($Token) {
    $headers.Authorization = "Bearer $Token"
  }

  $params = @{
    Method      = $Method
    Uri         = "$BaseUrl$Path"
    Headers     = $headers
    ContentType = "application/json"
  }

  if ($null -ne $Body) {
    $params.Body = ($Body | ConvertTo-Json -Depth 20)
  }

  Invoke-RestMethod @params
}

function Ensure-Rule {
  param(
    [array]$Rules,
    [string]$Name,
    [hashtable]$Payload,
    [string]$Token
  )

  $existing = $Rules | Where-Object { $_.name -eq $Name } | Select-Object -First 1
  if ($existing) {
    Write-Host "Rule exists: $Name" -ForegroundColor DarkGray
    return $existing
  }

  Write-Host "Creating rule: $Name" -ForegroundColor Cyan
  return (Invoke-SiemApi -Method POST -Path "/api/rules" -Body $Payload -Token $Token).rule
}

Write-Host "Logging in to $BaseUrl as $Email" -ForegroundColor Cyan
$login = Invoke-SiemApi -Method POST -Path "/api/auth/login" -Body @{
  email    = $Email
  password = $Password
}
$token = $login.access_token

$rulesResponse = Invoke-SiemApi -Method GET -Path "/api/rules" -Token $token
$rules = @($rulesResponse.rules)

Ensure-Rule -Rules $rules -Name "Suspicious Login Success After Failures" -Token $token -Payload @{
  name         = "Suspicious Login Success After Failures"
  description  = "Detect successful login after repeated failures from same source and user"
  severity     = "HIGH"
  type         = "correlation"
  conditions   = @{}
  actions      = @(@{ type = "create_alert" })
  is_enabled   = $true
  mitre_tactic = "Credential Access"
  mitre_tech   = "T1110"
} | Out-Null

Ensure-Rule -Rules $rules -Name "Credential Dumping Tool Detected" -Token $token -Payload @{
  name         = "Credential Dumping Tool Detected"
  description  = "Detect Mimikatz or credential dumping indicators from endpoint logs"
  severity     = "CRITICAL"
  type         = "regex"
  conditions   = @{ pattern = "(mimikatz|sekurlsa|lsass dump|credential dumping)" }
  actions      = @(@{ type = "create_alert" })
  is_enabled   = $true
  mitre_tactic = "Credential Access"
  mitre_tech   = "T1003"
} | Out-Null

$runId = Get-Date -Format "yyyyMMdd-HHmmss"
$attackIp = "203.0.113.50"
$targetIp = "10.0.0.25"
$logs = @()

for ($i = 1; $i -le 10; $i++) {
  $logs += @{
    severity   = "HIGH"
    category   = "authentication"
    message    = "failed login for user admin from $attackIp demo_run=$runId attempt=$i"
    ip_src     = $attackIp
    ip_dst     = $targetIp
    user_name  = "admin"
    host_name  = "vpn-gateway-01"
    extra_data = @{
      scenario = "brute_force"
      run_id   = $runId
    }
  }
}

$logs += @{
  severity   = "HIGH"
  category   = "authentication"
  message    = "login success for user admin from $attackIp demo_run=$runId"
  ip_src     = $attackIp
  ip_dst     = $targetIp
  user_name  = "admin"
  host_name  = "vpn-gateway-01"
  extra_data = @{
    scenario = "success_after_failures"
    run_id   = $runId
  }
}

$logs += @{
  severity   = "CRITICAL"
  category   = "web"
  message    = "WAF blocked SQL injection: GET /login?id=1 UNION SELECT password FROM users demo_run=$runId"
  ip_src     = "198.51.100.77"
  ip_dst     = "10.0.0.80"
  user_name  = "anonymous"
  host_name  = "public-web-01"
  extra_data = @{
    scenario = "sql_injection"
    run_id   = $runId
  }
}

$logs += @{
  severity   = "CRITICAL"
  category   = "endpoint"
  message    = "EDR alert: mimikatz sekurlsa credential dumping behavior detected on workstation demo_run=$runId"
  ip_src     = "10.0.0.44"
  ip_dst     = "10.0.0.44"
  user_name  = "alice"
  host_name  = "win11-finance-04"
  extra_data = @{
    scenario = "credential_dumping"
    run_id   = $runId
  }
}

Write-Host "Sending $($logs.Count) attack simulation logs with run id $runId" -ForegroundColor Cyan
$ingest = Invoke-SiemApi -Method POST -Path "/api/logs/ingest" -Token $token -Body @{
  source_api_key = $SourceApiKey
  logs           = $logs
}

Write-Host "Accepted: $($ingest.accepted) logs from source $($ingest.source)" -ForegroundColor Green
Write-Host "Waiting for queue, rule engine, and alert deduplication..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

$alerts = Invoke-SiemApi -Method GET -Path "/api/alerts?status=open" -Token $token
$matchingLogs = Invoke-SiemApi -Method GET -Path "/api/logs?search=$runId&limit=50" -Token $token

Write-Host ""
Write-Host "Demo evidence" -ForegroundColor Green
Write-Host "Run ID: $runId"
Write-Host "Logs visible in Logs page search: $($matchingLogs.logs.Count)"
Write-Host "Open alerts visible in Alerts page: $(@($alerts.alerts).Count)"
Write-Host ""
Write-Host "Expected alert names:"
Write-Host "- Brute Force Login Attempts triggered"
Write-Host "- Suspicious Login Success After Failures triggered"
Write-Host "- SQL Injection Pattern triggered"
Write-Host "- Credential Dumping Tool Detected triggered"
Write-Host ""
Write-Host "Next UI steps:"
Write-Host "1. Open Dashboard and confirm event volume, severity, top sources, and asset health changed."
Write-Host "2. Open Logs and search for run id $runId."
Write-Host "3. Open Alerts, acknowledge one alert, then create/link an incident."
Write-Host "4. Open AI Analysis and paste the run logs or selected alert details for triage/forensics."
