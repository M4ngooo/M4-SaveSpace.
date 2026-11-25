@echo off
chcp 65001 > nul
title Start Aplikacji Money

echo ========================================
echo   Money - Start aplikacji
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [BLAD] Node.js nie jest zainstalowany. Pobierz z https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo [INFO] Brak node_modules - instaluje zaleznosci (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [BLAD] npm install nie powiodlo sie.
        pause
        exit /b 1
    )
    echo [OK] Zaleznosci zainstalowane.
) else (
    echo [OK] Zaleznosci juz sa - pomijam npm install.
)

echo.
echo [INFO] Uruchamiam serwer deweloperski (npm run dev)...
echo [INFO] Adres: http://localhost:5173
echo [INFO] Aby zatrzymac, nacisnij Ctrl+C
echo.

npm run dev
pause