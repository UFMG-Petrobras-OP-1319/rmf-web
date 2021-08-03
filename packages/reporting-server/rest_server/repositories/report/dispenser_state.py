from typing import Optional

from models.pydantic_models import DispenserState_Pydantic
from models.tortoise_models.dispenser_state import DispenserState
from rest_server.repositories.report.utils import get_date_range_query


async def get_dispenser_state(
    offset: int,
    limit: int,
    to_log_date: Optional[str] = None,
    from_log_date: Optional[str] = None,
):
    query = get_date_range_query(to_log_date, from_log_date)

    return await DispenserState_Pydantic.from_queryset(
        DispenserState.filter(**query).offset(offset).limit(limit).order_by("-created")
    )
