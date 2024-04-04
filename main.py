from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import chat
import settings
from speech import stt, tts
from pathlib import Path
import shutil

app = FastAPI()
app.mount("/static", StaticFiles(directory = "static"), name ="static")

@app.get("/")
async def get_index():
    return FileResponse(Path("static/index.html"))

@app.get("/{filename:path}")
async def get_static_file(filename: str):
    static_path = Path(f"static/{filename}")
    return FileResponse(static_path)

@app.post("/chat/")
async def post_to_chat(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    out = 'audio/response.wav'
    tts(chat.prompt(stt(file.filename)), out)
    return FileResponse(out)

@app.delete("/chat/")
async def delete_chat():
    chat.clear()

@app.put("/settings/model/")
async def update_settings(new_model: str):
    settings.model = new_model

@app.put("/settings/voice/")
async def update_settings(new_voice: str):
    settings.voice = new_voice

async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code = exc.status_code)