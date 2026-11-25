$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Money - start aplikacji" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[BLAD] Node.js nie jest zainstalowany. Pobierz z https://nodejs.org/" -ForegroundColor Red
    Read-Host "Nacisnij Enter, aby zamknac"
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Brak node_modules - instaluje zaleznosci (npm install)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[BLAD] npm install nie powiodlo sie." -ForegroundColor Red
        Read-Host "Nacisnij Enter, aby zamknac"
        exit 1
    }
    Write-Host "[OK] Zaleznosci zainstalowane." -ForegroundColor Green
} else {
    Write-Host "[OK] Zaleznosci juz sa - pomijam npm install." -ForegroundColor Green
}

Write-Host ""
Write-Host "[INFO] Uruchamiam serwer deweloperski (npm run dev)..." -ForegroundColor Cyan
Write-Host "[INFO] Adres: http://localhost:5173" -ForegroundColor Cyan
Write-Host "[INFO] Aby zatrzymac, nacisnij Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

npm run dev