# chat/manager.py
import asyncio
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Map room_id -> list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.active_connections.setdefault(room_id, []).append(websocket)

    async def disconnect(self, room_id: str, websocket: WebSocket):
        async with self.lock:
            conns = self.active_connections.get(room_id, [])
            if websocket in conns:
                conns.remove(websocket)
            if not conns:
                # optionally delete empty room list
                self.active_connections.pop(room_id, None)

    async def broadcast(self, room_id: str, message: str):
        async with self.lock:
            conns = list(self.active_connections.get(room_id, []))
        for connection in conns:
            try:
                await connection.send_text(message)
            except Exception:
                # you might want to catch & log errors
                pass
