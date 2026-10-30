"""HTTP API for the ForgeAI machine-failure predictor."""

from __future__ import annotations

import os
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, confloat

from src.models.explainability import ExplainabilityError, MachineFailureExplainer
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


class ExplanationFeature(BaseModel):
    """One model feature's probability-scale SHAP contribution."""

    name: str
    display_name: str
    value: float
    unit: str
    shap_value: float
    direction: Literal["positive", "negative"]


class ExplanationResponse(BaseModel):
    """Probability-scale explanation for the failure class."""

    base_value: float
    output_value: float
    features: list[ExplanationFeature]


app = FastAPI(
    title="ForgeAI Machine Failure API",
    description=(
        "Predictive-maintenance API using the existing ForgeAI Random Forest "
        "inference service."
    ),
    version="1.0.0",
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "FORGEAI_CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://localhost:4173,"
        "http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:4173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def _create_predictor() -> MachineFailurePredictor | None:
    """Load the predictor once; keep startup usable when artifacts are unavailable."""
    try:
        return MachineFailurePredictor()
    except (FileNotFoundError, TypeError, ValueError):
        return None


predictor = _create_predictor()
explainer = MachineFailureExplainer(predictor) if predictor is not None else None


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


@app.post(
    "/predict/explain",
    response_model=ExplanationResponse,
    summary="Explain machine failure prediction",
    description=(
        "Return probability-scale SHAP contributions for the failure class "
        "using the same model and feature engineering as /predict."
    ),
)
def explain_machine_failure(sensor_input: SensorInput) -> ExplanationResponse:
    if predictor is None or explainer is None:
        raise HTTPException(
            status_code=503,
            detail="The prediction model is not available.",
        )

    try:
        input_values: dict[str, Any] = sensor_input.model_dump(by_alias=True)
        result = explainer.explain(input_values)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except (ExplainabilityError, RuntimeError, OSError) as error:
        raise HTTPException(
            status_code=500,
            detail="The prediction explanation service could not process the request.",
        ) from error

    return ExplanationResponse(**result)
