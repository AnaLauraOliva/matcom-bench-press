# Comandos de desarrollo para Windows. Equivale al Makefile en Linux/macOS.
param(
    [Parameter(Position = 0)]
    [ValidateSet('help', 'install', 'start', 'stop', 'db-migrate', 'db-seed', 'mongo-seed', 'db-studio', 'check', 'reset')]
    [string]$Command = 'help'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Logs = Join-Path $Root 'logs'
$Pids = Join-Path $Root 'pids'

function Assert-LastExitCode {
    if ($LASTEXITCODE -ne 0) {
        throw "El comando anterior terminó con el código $LASTEXITCODE."
    }
}

function Assert-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw 'Docker no está instalado o no está en el PATH.'
    }
    $dockerInfo = & docker info --format '{{.ServerVersion}}' 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($dockerInfo)) {
        throw @"
El demonio de Docker no está en ejecución.
Inicia Docker Desktop y espera a que esté listo, luego vuelve a ejecutar el comando.
"@
    }
}

function Assert-Env {
    $missing = @()
    if (-not (Test-Path (Join-Path $Root '.env'))) { $missing += '.env' }
    if (-not (Test-Path (Join-Path $Root 'backend\.env'))) { $missing += 'backend\.env' }
    $frontEnv = (Test-Path (Join-Path $Root 'frontend\.env')) -or (Test-Path (Join-Path $Root 'frontend\.env.local'))
    if (-not $frontEnv) { $missing += 'frontend\.env o frontend\.env.local' }
    if ($missing.Count -gt 0) {
        throw 'Faltan archivos de entorno: ' + ($missing -join ', ') + '. Cópialos desde los .env.example.'
    }
}

function Assert-NoForeignContainer {
    $name = 'matcom_bench_press_postgres'
    $expected = (Join-Path $Root 'docker-compose.yml').Replace('/', '\')
    $labelsJson = $null
    try {
        $labelsJson = & docker inspect $name --format '{{json .Config.Labels}}' 2>$null
    }
    catch {
        # El contenedor no existe: no hay conflicto posible, se continúa.
        return
    }
    if ([string]::IsNullOrWhiteSpace($labelsJson)) { return }

    $labels = $labelsJson | ConvertFrom-Json
    $config = [string]$labels.'com.docker.compose.project.config_files'
    $project = [string]$labels.'com.docker.compose.project'
    if ($config.Replace('/', '\') -ine $expected) {
        throw @"
Ya existe el contenedor $name del proyecto '$project', creado desde:
  $config
No pertenece a este directorio y ocupa ese nombre (y probablemente el puerto 5432).
Detén ese proyecto desde su propia carpeta con 'docker compose down'.
No lo elimines sin confirmar: tiene su propio volumen de datos.
"@
    }
}

function Invoke-Npm {
    param([string]$Directory, [string[]]$Arguments)
    Push-Location (Join-Path $Root $Directory)
    try {
        & npm @Arguments
        Assert-LastExitCode
    }
    finally {
        Pop-Location
    }
}

function Stop-DevProcesses {
    # shortcut: se confía en el PID guardado; tras un reinicio del sistema podría haberse reciclado.
    foreach ($name in @('backend', 'frontend')) {
        $file = Join-Path $Pids "$name.pid"
        if (Test-Path $file) {
            $processId = (Get-Content $file).Trim()
            # Si el usuario cerró la terminal manualmente, el proceso ya no existe:
            # solo limpiamos el archivo .pid y seguimos sin lanzar error.
            if (-not (Get-Process -Id $processId -ErrorAction SilentlyContinue)) {
                Remove-Item $file -Force
                continue
            }
            try {
                & taskkill /PID $processId /T /F 2>$null | Out-Null
            } catch {
                # El proceso pudo desaparecer entre la comprobación y el kill.
            }
            Remove-Item $file -Force
        }
    }
}

function Invoke-Install {
    Invoke-Npm -Directory 'backend' -Arguments @('install')
    Invoke-Npm -Directory 'frontend' -Arguments @('install')
    Write-Host 'Dependencias instaladas.'
}

function Invoke-Start {
    Assert-Docker
    Assert-Env
    Assert-NoForeignContainer
    Stop-DevProcesses
    New-Item -ItemType Directory -Force -Path $Logs, $Pids | Out-Null

    & docker compose up -d --wait
    Assert-LastExitCode

    $services = @(
        @{ Name = 'backend'; Directory = 'backend' },
        @{ Name = 'frontend'; Directory = 'frontend' }
    )
    foreach ($service in $services) {
        $workingDir = Join-Path $Root $service.Directory
        $process = Start-Process -FilePath 'powershell.exe' `
            -ArgumentList @('-NoExit', '-Command', "cd `'$workingDir`'; npm run dev") `
            -WindowStyle Normal -PassThru
        Set-Content -Path (Join-Path $Pids "$($service.Name).pid") -Value $process.Id
    }
    Write-Host 'Backend:  http://localhost:3000  (terminal abierta)'
    Write-Host 'Frontend: http://localhost:5173  (terminal abierta)'
}

function Invoke-Stop {
    Stop-DevProcesses
    Assert-Docker
    # docker compose down no falla si no hay contenedores, pero lo envolvemos
    # por si acaso para no romper el flujo cuando el usuario ya cerró todo manualmente.
    try {
        & docker compose down
        Assert-LastExitCode
    } catch {
        Write-Warning 'No se pudo detener Docker Compose (puede que ya esté detenido).'
    }
    Write-Host 'Servicios detenidos. Los datos de PostgreSQL y MongoDB se conservan.'
}

function Invoke-Reset {
    Invoke-Stop
    & docker compose down -v
    Assert-LastExitCode
    Invoke-Start
    Invoke-Npm -Directory 'backend' -Arguments @('run', 'prisma:migrate')
    Invoke-Npm -Directory 'backend' -Arguments @('run', 'prisma:seed')
    Invoke-Npm -Directory 'backend' -Arguments @('run', 'mongo:seed')
    Write-Host 'Base de datos reiniciada y cargada con datos de ejemplo.'
}

function Invoke-Check {
    Invoke-Npm -Directory 'backend' -Arguments @('run', 'typecheck')
    Invoke-Npm -Directory 'backend' -Arguments @('run', 'build')
    Invoke-Npm -Directory 'frontend' -Arguments @('run', 'lint')
    Invoke-Npm -Directory 'frontend' -Arguments @('run', 'build')
}

function Show-Help {
    @'
Uso: .\dev.ps1 <comando>

  install     Instala dependencias de backend y frontend
  start       Levanta PostgreSQL, backend y frontend
  stop        Apaga backend, frontend, PostgreSQL y MongoDB
  db-migrate  Aplica migraciones de Prisma
  db-seed      Carga datos de ejemplo
  mongo-seed  Carga estructuras de rutina en MongoDB
  db-studio   Abre Prisma Studio
  check       Typecheck, lint y build de ambos proyectos
  reset       Borra la BD y la reconstruye (DESTRUCTIVO)
'@ | Write-Host
}

Push-Location $Root
try {
    switch ($Command) {
        'install' { Invoke-Install }
        'start' { Invoke-Start }
        'stop' { Invoke-Stop }
        'db-migrate' { Invoke-Npm -Directory 'backend' -Arguments @('run', 'prisma:migrate') }
        'db-seed' { Invoke-Npm -Directory 'backend' -Arguments @('run', 'prisma:seed') }
        'mongo-seed' { Invoke-Npm -Directory 'backend' -Arguments @('run', 'mongo:seed') }
        'db-studio' { Invoke-Npm -Directory 'backend' -Arguments @('run', 'prisma:studio') }
        'check' { Invoke-Check }
        'reset' { Invoke-Reset }
        default { Show-Help }
    }
}
finally {
    Pop-Location
}
