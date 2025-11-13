from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db
from models import User, SearchHistory, Topic
from schemas import DashboardResponse, SearchHistoryResponse, GroupResponse, TopicResponse
from dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recent_searches = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(desc(SearchHistory.searched_at))
        .limit(10)
        .all()
    )

    joined_groups = current_user.groups

    all_topics = db.query(Topic).limit(10).all()
    recommended_topics = [
        topic for topic in all_topics if topic not in current_user.interests
    ]

    return {
        "recent_searches": [
            SearchHistoryResponse.model_validate(search) for search in recent_searches
        ],
        "joined_groups": [
            GroupResponse.model_validate(group) for group in joined_groups
        ],
        "recommended_topics": [
            TopicResponse.model_validate(topic) for topic in recommended_topics[:5]
        ],
    }
