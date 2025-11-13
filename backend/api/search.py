from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import requests
from database import get_db
from models import User, SearchHistory, Topic
from schemas import SearchResultsResponse
from dependencies import get_current_user
from config import get_settings

router = APIRouter(prefix="/api/search", tags=["search"])
settings = get_settings()


@router.get("/{topic}", response_model=SearchResultsResponse)
def search_topic(
    topic: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    search_history = SearchHistory(
        user_id=current_user.id,
        topic=topic,
    )
    db.add(search_history)
    db.commit()

    db_topic = db.query(Topic).filter(Topic.name == topic).first()
    if not db_topic:
        db_topic = Topic(name=topic)
        db.add(db_topic)
        db.commit()

    videos = search_youtube(topic)
    articles = search_articles(topic)

    return {
        "videos": videos,
        "articles": articles,
    }


def search_youtube(query: str) -> list:
    if not settings.YOUTUBE_API_KEY:
        return [
            {
                "id": f"placeholder_{i}",
                "title": f"Sample {query} Video {i+1}",
                "description": f"This is a sample video about {query}. Please configure your YouTube API key to fetch real videos.",
                "thumbnail": "https://via.placeholder.com/320x180?text=YouTube",
                "url": f"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            }
            for i in range(3)
        ]

    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": 10,
            "key": settings.YOUTUBE_API_KEY,
        }

        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        videos = []
        for item in data.get("items", []):
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})

            if video_id:
                videos.append(
                    {
                        "id": video_id,
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                        "thumbnail": snippet.get("thumbnails", {})
                        .get("medium", {})
                        .get("url", ""),
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                    }
                )

        return videos

    except Exception as e:
        print(f"YouTube search error: {e}")
        return []


def search_articles(query: str) -> list:
    if not settings.BING_SEARCH_API_KEY:
        return [
            {
                "title": f"Sample {query} Article {i+1}",
                "description": f"This is a sample article about {query}. Please configure your Bing Search API key to fetch real articles.",
                "url": f"https://example.com/article-{i+1}",
                "source": "Example Source",
            }
            for i in range(3)
        ]

    try:
        url = "https://api.bing.microsoft.com/v7.0/search"
        headers = {"Ocp-Apim-Subscription-Key": settings.BING_SEARCH_API_KEY}
        params = {
            "q": query,
            "count": 10,
        }

        response = requests.get(url, headers=headers, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        articles = []
        for item in data.get("webPages", {}).get("value", []):
            articles.append(
                {
                    "title": item.get("name", ""),
                    "description": item.get("snippet", ""),
                    "url": item.get("url", ""),
                    "source": item.get("displayUrl", ""),
                }
            )

        return articles

    except Exception as e:
        print(f"Bing search error: {e}")
        return []
