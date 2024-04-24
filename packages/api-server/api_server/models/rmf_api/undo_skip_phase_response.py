# generated by datamodel-codegen:
#   filename:  undo_skip_phase_response.json

from __future__ import annotations

from pydantic import Field, RootModel

from . import simple_response


class UndoPhaseSkipResponse(RootModel[simple_response.SimpleResponse]):
    root: simple_response.SimpleResponse = Field(
        ...,
        description="Response to an undo phase skip request",
        title="Undo Phase Skip Response",
    )
