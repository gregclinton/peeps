from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from chat import process
from speech import stt, tts
from pathlib import Path
import shutil

app = FastAPI()
app.mount("/static", StaticFiles(directory = "static"), name ="static")

@app.get("/")
async def get_index():
    return FileResponse(Path("static/index.html"))

@app.post("/chat/")
async def post_to_chat(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    tts(process(stt(file.filename)), 'out.wav')
    return FileResponse('out.wav')