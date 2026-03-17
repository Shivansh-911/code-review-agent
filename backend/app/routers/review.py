import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError, jwt
from app.config import settings
from app.services.chunker import chunk_code
from app.services.llm import review_chunk

router = APIRouter(tags=["review"])

def verify_ws_token(token: str) -> int | None:
    """Validate JWT from WebSocket query param, return user_id or None."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        return None

@router.websocket("/ws/review")
async def review_websocket(
    websocket: WebSocket,
    token: str = Query(...),
):
    user_id = verify_ws_token(token)
    if not user_id:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    await websocket.accept()

    try:
        # Receive the code payload
        raw = await websocket.receive_text()
        data = json.loads(raw)
        code: str = data.get("code", "").strip()

        if not code:
            await websocket.send_json({"event": "error", "message": "No code provided"})
            await websocket.close()
            return

        chunks = chunk_code(code)
        total = len(chunks)

        # Announce start
        await websocket.send_json({
            "event": "start",
            "total_chunks": total,
            "message": f"Reviewing {total} chunk(s)...",
        })

        # Process chunks — concurrently with a semaphore to avoid rate-limiting
        semaphore = asyncio.Semaphore(3)  # max 3 parallel Groq calls

        async def process_chunk(index: int, chunk: str):
            async with semaphore:
                report = await review_chunk(chunk, index, total)
                await websocket.send_json({"event": "chunk", "data": report})

        tasks = [process_chunk(i, chunk) for i, chunk in enumerate(chunks)]
        await asyncio.gather(*tasks)

        # Send completion event
        await websocket.send_json({"event": "done", "message": "Review complete"})

    except WebSocketDisconnect:
        pass
    except json.JSONDecodeError:
        await websocket.send_json({"event": "error", "message": "Invalid JSON payload"})
    except Exception as e:
        await websocket.send_json({"event": "error", "message": str(e)})
    finally:
        try:
            await websocket.close()
        except Exception:
            pass