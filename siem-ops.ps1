param(
  [ValidateSet("all", "start", "health", "backup", "restore", "stop")]
  [string]$Action = "all",
  [string]$BackupFile = ""
)

$ErrorActionPreference = "Stop"

$ProjectRoot = if ($PSScriptRoot) {
  $PSScriptRoot
} else {
  Split-Path -Parent $MyInvocation.MyCommand.Path
}

Set-Location $ProjectRoot

function Invoke-Compose {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)

  Write-Host ">> docker compose $($Args -join ' ')" -ForegroundColor Cyan
  & docker compose @Args
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose command failed: docker compose $($Args -join ' ')"
  }
}

function Ensure-DbRunning {
  Invoke-Compose up -d postgres redis
}

function Start-App {
  Ensure-DbRunning
  Invoke-Compose up -d backend frontend
}

function Show-Health {
  Invoke-Compose ps

  Write-Host ">> GET http://localhost:3001/health" -ForegroundColor Cyan
  $health = Invoke-RestMethod "http://localhost:3001/health"
  $health | Format-Table

  Invoke-Compose exec -T postgres psql -U siem_user -d siem_db -c "SELECT NOW();"
  Invoke-Compose exec -T redis redis-cli ping
}

function Backup-Db {
  Ensure-DbRunning

  $backupDir = Join-Path $ProjectRoot "backups"
  if (-not (Test-Path -LiteralPath $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
  }

  $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
  $backupPath = Join-Path $backupDir "siem_db_$timestamp.sql"

  Write-Host ">> Creating backup: $backupPath" -ForegroundColor Cyan
  $dump = & docker compose exec -T postgres pg_dump -U siem_user -d siem_db
  if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed."
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($backupPath, $dump, $utf8NoBom)

  Write-Host "Backup created: $backupPath" -ForegroundColor Green
  return $backupPath
}

function Restore-Db {
  param([string]$RestoreFile)

  Ensure-DbRunning

  $target = $RestoreFile
  if ([string]::IsNullOrWhiteSpace($target)) {
    $target = Get-ChildItem (Join-Path $ProjectRoot "backups") -Filter "siem_db_*.sql" -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime -Descending |
      Select-Object -First 1 -ExpandProperty FullName
  }

  if ([string]::IsNullOrWhiteSpace($target) -or -not (Test-Path -LiteralPath $target)) {
    throw "Backup file not found. Pass -BackupFile or create a backup first."
  }

  Write-Host ">> Restoring backup: $target" -ForegroundColor Yellow
  Invoke-Compose exec -T postgres psql -U siem_user -d siem_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

  $sql = Get-Content -Raw -LiteralPath $target
  $sql | & docker compose exec -T postgres psql -U siem_user -d siem_db
  if ($LASTEXITCODE -ne 0) {
    throw "Restore failed while applying SQL."
  }

  Write-Host "Restore complete." -ForegroundColor Green
}

function Stop-App {
  Invoke-Compose down
}

switch ($Action) {
  "all" {
    Start-App
    Show-Health
    Backup-Db | Out-Null
  }
  "start" { Start-App }
  "health" { Show-Health }
  "backup" { Backup-Db | Out-Null }
  "restore" { Restore-Db -RestoreFile $BackupFile }
  "stop" { Stop-App }
}

