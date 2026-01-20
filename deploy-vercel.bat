@echo off
echo.
echo ═══════════════════════════════════════════════════════
echo   🚀 Haciendo deploy de FinanGest...
echo ═══════════════════════════════════════════════════════
echo.

cd public
vercel --prod --yes

echo.
echo ═══════════════════════════════════════════════════════
echo   ✅ Deploy completado!
echo ═══════════════════════════════════════════════════════
echo.
pause
