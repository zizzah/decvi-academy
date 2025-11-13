# chat/routes.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Optionally: include user info or structured data, e.g. JSON
            await manager.broadcast(room_id, data)
    except WebSocketDisconnect:
        await manager.disconnect(room_id, websocket)
