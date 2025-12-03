@echo off
echo Running database migration for content tables...
echo.
curl -X POST http://localhost:3000/api/admin/migrate-content
echo.
echo.
echo Migration complete! Press any key to exit...
pause > nul
