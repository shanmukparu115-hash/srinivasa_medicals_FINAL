@echo off
echo ================================================================
echo Sri Srinivasa Medicals — MySQL Database Backup Utility
echo ================================================================
echo.

set DB_HOST=127.0.0.1
set DB_USER=root
set DB_PASS=MySQL@123
set DB_NAME=srinivasa_medicals
set BACKUP_FILE=srinivasa_medicals_backup.sql
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin

echo Backing up database '%DB_NAME%' to '%BACKUP_FILE%'...
"%MYSQL_BIN%\mysqldump" -h %DB_HOST% -u %DB_USER% -p%DB_PASS% %DB_NAME% > %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Backup complete! Saved to %BACKUP_FILE%
) else (
    echo.
    echo ❌ Error: Backup failed. Please verify MySQL configuration and connection.
)
pause
