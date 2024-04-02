from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from chat import haiku

app = FastAPI()

@app.get('/', response_class = HTMLResponse)
async def read():
    return open('index.html').read()

@app.get('/test')
async def read_test():
    return {'abc': haiku()}