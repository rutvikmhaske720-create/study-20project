from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Group, User, Topic, GroupResource
from schemas import GroupCreate, GroupResponse, GroupResourceCreate
from dependencies import get_current_user

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.post("", response_model=GroupResponse)
def create_group(
    group_data: GroupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    topic = db.query(Topic).filter(Topic.id == group_data.topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )

    new_group = Group(
        title=group_data.title,
        description=group_data.description,
        topic_id=group_data.topic_id,
        created_by=current_user.id,
    )
    new_group.members.append(current_user)

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return GroupResponse.model_validate(new_group)


@router.get("", response_model=list[GroupResponse])
def list_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()
    return [GroupResponse.model_validate(group) for group in groups]


@router.get("/{group_id}", response_model=GroupResponse)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found",
        )

    return GroupResponse.model_validate(group)


@router.post("/{group_id}/join")
def join_group(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found",
        )

    if current_user in group.members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already a member of this group",
        )

    group.members.append(current_user)
    db.commit()
    db.refresh(group)

    return GroupResponse.model_validate(group)


@router.post("/{group_id}/leave")
def leave_group(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found",
        )

    if current_user not in group.members:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not a member of this group",
        )

    group.members.remove(current_user)
    db.commit()
    db.refresh(group)

    return {"message": "Left group successfully"}


@router.post("/{group_id}/resources", response_model=dict)
def add_resource(
    group_id: int,
    resource_data: GroupResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found",
        )

    if current_user not in group.members:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group members can add resources",
        )

    new_resource = GroupResource(
        group_id=group_id,
        title=resource_data.title,
        url=resource_data.url,
        resource_type=resource_data.resource_type,
        shared_by=current_user.id,
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return {"message": "Resource added successfully"}
