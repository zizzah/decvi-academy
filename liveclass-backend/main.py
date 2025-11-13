# main.py
from fastapi import FastAPI
from chat import routes as chat_routes
from classes import routes as class_routes

app = FastAPI()

# Include routers
app.include_router(chat_routes.router)
app.include_router(class_routes.router)

@app.get("/")
async def root():
    return {"message": "Liveclass backend running!"}
