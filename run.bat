@echo off
cd /d %~dp0

REM Crear entorno virtual si no existe
if not exist venv (
    python -m venv venv
)

REM Activar entorno
call venv\Scripts\activate

REM Instalar dependencias
pip install -r requirements.txt

REM Abrir navegador
start http://127.0.0.1:5000

REM Ejecutar flask app
python app.py

pause
