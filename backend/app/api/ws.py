from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import can
import time
from datetime import datetime

router = APIRouter()
bus = can.interface.Bus(
    channel="can0",        
    interface="socketcan"
)
def classify_packet(msg):
    attack = "Normal"
    prediction = "Normal"
    severity = "Low"
    confidence = 99.2

    if msg.arbitration_id == 0x000:
        prediction = "Attack"
        attack = "DoS"
        severity = "High"
        confidence = 99.8
    return prediction, attack, severity, confidence


@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):

    await websocket.accept()
    try:
        while True:

            msg = bus.recv(timeout=1)

            if msg is None:
                await asyncio.sleep(0.01)
                continue

            payload = " ".join(
                f"{byte:02X}"
                for byte in msg.data
            )
            prediction, attack, severity, confidence = classify_packet(msg)
            packet = {
                "id": str(time.time_ns()),
                "timestamp": datetime.utcnow().isoformat(),
                "can_id": hex(msg.arbitration_id),
                "dlc": msg.dlc,
                "payload": payload,
                "prediction": prediction,
                "attack_type": attack,
                "severity": severity,
                "confidence": confidence,
            }
            await websocket.send_json(packet)

    except WebSocketDisconnect:
        print("WebSocket disconnected")