from fastapi import APIRouter, Depends, Query
from app.services import data_service
from app.security import auth_handler
from app.schemas.token import TokenData
from typing import Optional


router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)

@router.get("/")
def get_metrics(
    current_user: TokenData = Depends(auth_handler.get_current_user),
    page: int = 1,
    size: int = 100,
    sort_by: Optional[str] = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    metrics_data = data_service.get_metrics(
        role=current_user.role,
        page=page,
        size=size,
        sort_by=sort_by,
        sort_order=sort_order,
        start_date=start_date,
        end_date=end_date
    )
    return metrics_data