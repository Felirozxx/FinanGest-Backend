@echo off
echo ========================================
echo   VERIFICACION DE ARCHIVOS - FinanGest
echo ========================================
echo.

echo Verificando archivos PWA...
echo.

if exist "public\manifest.json" (
    echo [OK] manifest.json existe
) else (
    echo [ERROR] manifest.json NO existe
)

if exist "public\sw.js" (
    echo [OK] sw.js existe
) else (
    echo [ERROR] sw.js NO existe
)

if exist "public\icons\Icon-192.png" (
    echo [OK] Icon-192.png existe
) else (
    echo [ERROR] Icon-192.png NO existe
)

if exist "public\icons\Icon-512.png" (
    echo [OK] Icon-512.png existe
) else (
    echo [ERROR] Icon-512.png NO existe
)

echo.
echo Verificando archivos de backend...
echo.

if exist "gota-a-gota\backend\routes\auth.js" (
    echo [OK] auth.js existe
) else (
    echo [ERROR] auth.js NO existe
)

echo.
echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
