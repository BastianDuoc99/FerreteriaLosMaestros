<#
.SYNOPSIS
  Inicia MySQL 8 portable (sin Docker ni permisos de administrador) para el backend.
.EXAMPLE
  .\scripts\iniciar-mysql.ps1
  .\scripts\iniciar-mysql.ps1 -MysqlHome "C:\ruta\mysql-8.4"
#>
param(
  [string]$MysqlHome = "$env:USERPROFILE\mysql-8.4",
  [int]$Port = 3306
)

$ErrorActionPreference = 'Stop'

$bin = Join-Path $MysqlHome 'bin'
$datadir = Join-Path $MysqlHome 'data'

if (-not (Test-Path (Join-Path $bin 'mysqld.exe'))) {
  throw "No se encontró mysqld.exe en $bin. Revisa el parámetro -MysqlHome."
}

if (-not (Test-Path (Join-Path $datadir 'mysql'))) {
  Write-Host "Inicializando datos de MySQL en $datadir ..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Force -Path $datadir | Out-Null
  & (Join-Path $bin 'mysqld.exe') '--initialize-insecure' "--basedir=$MysqlHome" "--datadir=$datadir"
  if ($LASTEXITCODE -ne 0) { throw "Falló la inicialización de MySQL (exit $LASTEXITCODE)." }
}

$escucha = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if (-not $escucha) {
  Write-Host "Iniciando mysqld en el puerto $Port ..." -ForegroundColor Yellow
  Start-Process -FilePath (Join-Path $bin 'mysqld.exe') -ArgumentList @(
    "--basedir=$MysqlHome",
    "--datadir=$datadir",
    "--port=$Port",
    '--bind-address=127.0.0.1'
  ) -WindowStyle Hidden
}

$listo = $false
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Seconds 1
  $escucha = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($escucha) { $listo = $true; break }
}
if (-not $listo) { throw "MySQL no empezó a escuchar en el puerto $Port." }

$sql = @'
CREATE DATABASE IF NOT EXISTS ferreteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'ferreteria'@'localhost' IDENTIFIED BY 'ferreteria123';
CREATE USER IF NOT EXISTS 'ferreteria'@'%' IDENTIFIED BY 'ferreteria123';
GRANT ALL PRIVILEGES ON ferreteria.* TO 'ferreteria'@'localhost';
GRANT ALL PRIVILEGES ON ferreteria.* TO 'ferreteria'@'%';
FLUSH PRIVILEGES;
'@
$sql | & (Join-Path $bin 'mysql.exe') -h 127.0.0.1 -P $Port -u root --default-character-set=utf8mb4
if ($LASTEXITCODE -ne 0) { throw "Falló la creación de la BD/usuario (exit $LASTEXITCODE)." }

Write-Host "MySQL listo: jdbc:mysql://127.0.0.1:$Port/ferreteria (usuario ferreteria)." -ForegroundColor Green
