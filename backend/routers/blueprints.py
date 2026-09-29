"""
Blueprint persistence and sharing router.
"""

from fastapi import APIRouter, HTTPException, Query
from backend.models import BlueprintCreate
from backend.database import save_blueprint, get_blueprint, list_blueprints, delete_blueprint

router = APIRouter(prefix="/api/blueprints", tags=["Blueprints & Persistence"])

@router.get("")
def get_recent_blueprints(limit: int = Query(default=30, ge=1, le=100)):
    """List recently saved architecture blueprints."""
    return list_blueprints(limit=limit)

@router.post("")
def create_or_update_blueprint(data: BlueprintCreate):
    """Save an evaluated architecture blueprint to the database."""
    try:
        saved = save_blueprint(
            name=data.name,
            spec=data.spec,
            result=data.result,
            description=data.description or "",
            blueprint_id=data.id
        )
        if not saved:
            raise HTTPException(status_code=500, detail="Failed to save blueprint")
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{blueprint_id}")
def get_blueprint_by_id(blueprint_id: str):
    """Retrieve a saved blueprint by its unique identifier (for sharing or reloading)."""
    bp = get_blueprint(blueprint_id)
    if not bp:
        raise HTTPException(status_code=404, detail="Architecture blueprint not found")
    return bp

@router.delete("/{blueprint_id}")
def remove_blueprint(blueprint_id: str):
    """Delete a saved blueprint."""
    deleted = delete_blueprint(blueprint_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Blueprint not found or already deleted")
    return {"status": "success", "deletedId": blueprint_id}
