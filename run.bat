@echo off
echo Starting LCS Web Application...
echo.

echo Compiling C++ code...
g++ backend/lcs.cpp -o backend/lcs.exe
if %errorlevel% neq 0 (
    echo Error compiling C++ code
    pause
    exit /b 1
)
echo C++ compilation successful.
echo.

echo Starting Node.js server...
node backend/server.js