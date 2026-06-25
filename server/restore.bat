@echo off
echo ================================================================
echo Sri Srinivasa Medicals — MySQL Database Restore Utility
echo ================================================================
echo.

set DB_HOST=127.0.0.1
set DB_USER=root
set DB_PASS=MySQL@123
set DB_NAME=srinivasa_medicals
set BACKUP_FILE=srinivasa_medicals_backup.sql
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin

if not exist %BACKUP_FILE% (
    echo ❌ Error: Backup file '%BACKUP_FILE%' not found.
    goto end
)

echo Restoring database '%DB_NAME%' from '%BACKUP_FILE%'...
"%MYSQL_BIN%\mysql" -h %DB_HOST% -u %DB_USER% -p%DB_PASS% %DB_NAME% < %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database restoration completed successfully!
) else (
    echo.
    echo ❌ Error: Restoration failed.
)

:end
pause
