from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
from datetime import datetime

router = APIRouter()


@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:

            packet = {
                "id": f"pkt-{random.randint(100000,999999)}",
                "timestamp": datetime.utcnow().isoformat(),
                "can_id": hex(random.randint(0x100, 0x7FF)),
                "dlc": 8,
                "payload": " ".join(
                    f"{random.randint(0,255):02X}"
                    for _ in range(8)
                ),
                "prediction": random.choice(
                    [
                        "Normal",
                        "Attack"
                    ]
                ),
                "attack_type": random.choice(
                    [
                        "Normal",
                        "DoS",
                        "Fuzzy",
                        "Gear",
                        "RPM"
                    ]
                ),
                "severity": random.choice(
                    [
                        "Low",
                        "Medium",
                        "High"
                    ]
                ),
                "confidence": round(
                    random.uniform(90,99.9),
                    2
                )
            }

            await websocket.send_json(packet)

            await asyncio.sleep(0.15)

    except WebSocketDisconnect:
        print("WebSocket disconnected")