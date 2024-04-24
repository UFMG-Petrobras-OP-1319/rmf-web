# generated by datamodel-codegen:
#   filename:  rewind_task_response.json

from __future__ import annotations

from pydantic import Field, RootModel

from . import simple_response


class TaskRewindResponse(RootModel[simple_response.SimpleResponse]):
    root: simple_response.SimpleResponse = Field(
        ...,
        description="Response to a request to rewind a task",
        title="Task Rewind Response",
    )
