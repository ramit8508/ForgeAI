"""HTTP API for the ForgeAI machine-failure predictor."""

from __future__ import annotations

from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field, confloat

from src.models.inference import MachineFailurePredictor

FiniteFloat = confloat(allow_inf_nan=False)
RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]


class SensorInput(BaseModel):
    """Raw sensor values accepted by the prediction endpoint."""

    air_temperature: FiniteFloat = Field(
        ...,
        alias="Air temperature [K]",
        gt=0,
        description="Ambient air temperature in Kelvin.",
    )
    process_temperature: FiniteFloat = Field(
        ...,
        alias="Process temperature [K]",
        gt=0,
        description="Process temperature in Kelvin.",
    )
    rotational_speed: FiniteFloat = Field(
        ...,
        alias="Rotational speed [rpm]",
        ge=0,
        description="Rotational speed in revolutions per minute.",
    )
    torque: FiniteFloat = Field(
        ...,
        alias="Torque [Nm]",
        ge=0,
        description="Torque in Newton-metres.",
    )
    tool_wear: FiniteFloat = Field(
        ...,
        alias="Tool wear [min]",
        ge=0,
        description="Tool wear in minutes.",
    )

    model_config = ConfigDict(populate_by_name=True, extra="forbid")


class PredictionResponse(BaseModel):
    """Prediction returned to an API client."""

    machine_failure: int = Field(..., ge=0, le=1)
    failure_probability: float = Field(..., ge=0, le=1)
    risk_level: RiskLevel


app = FastAPI(
    title="ForgeAI Machine Failure API",
    description=(
        "Predictive-maintenance API using the existing ForgeAI Random Forest "
        "inference service."
    ),
    version="1.0.0",
)


def _create_predictor() -> MachineFailurePredictor | None:
    """Load the predictor once; keep startup usable when artifacts are unavailable."""
    try:
        return MachineFailurePredictor()
    except (FileNotFoundError, TypeError, ValueError):
        return None


predictor = _create_predictor()


@app.get(
    "/health",
    summary="Health check",
    description="Confirm that the API process is responding. This does not run a prediction.",
)
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict machine failure",
    description=(
        "Accept five raw machine sensor values and return the existing model's "
        "binary failure prediction, probability, and risk level."
    ),
)
def predict_machine_failure(sensor_input: SensorInput) -> PredictionResponse:
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="The prediction model is not available.",
        )

    try:
        input_values: dict[str, Any] = sensor_input.model_dump(by_alias=True)
        result = predictor.predict(input_values)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except (RuntimeError, OSError) as error:
        raise HTTPException(
            status_code=500,
            detail="The prediction service could not process the request.",
        ) from error

    return PredictionResponse(**result)
