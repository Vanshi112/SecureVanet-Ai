from fastapi import APIRouter
router = APIRouter()

@router.get('/health')
async def health():
    return {'status': 'healthy', 'model': 'Transformer IDS', 'version': '1.0.0'}
