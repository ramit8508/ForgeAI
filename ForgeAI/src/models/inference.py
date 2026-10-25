"""Reusable model inference for machine-failure predictions."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib

from src.features.engineering import build_feature_row


@dataclass(frozen=True)
class RiskThresholds:
    """Probability boundaries used to assign a risk level."""

    low_upper: float = 0.30
    medium_upper: float = 0.70

    def __post_init__(self) -> None:
        if not 0 <= self.low_upper < self.medium_upper <= 1:
            raise ValueError(
                "Risk thresholds must satisfy 0 <= low_upper < medium_upper <= 1"
            )


class MachineFailurePredictor:
    """Load a trained classifier and predict failure risk for one machine."""

    def __init__(
        self,
        model_path: str | Path | None = None,
        feature_schema_path: str | Path | None = None,
        thresholds: RiskThresholds | None = None,
        classification_threshold: float = 0.45,
    ) -> None:
        project_root = Path(__file__).resolve().parents[2]
        self.model_path = Path(model_path or project_root / "models" / "random_forest_failure_model.pkl")
        self.feature_schema_path = Path(
            feature_schema_path or project_root / "models" / "feature_columns.pkl"
        )
        self.thresholds = thresholds or RiskThresholds()
        if not 0 <= classification_threshold <= 1:
            raise ValueError("Classification threshold must be between 0 and 1")
        self.classification_threshold = classification_threshold

        if not self.model_path.is_file():
            raise FileNotFoundError(f"Model artifact was not found: {self.model_path}")
        if not self.feature_schema_path.is_file():
            raise FileNotFoundError(
                f"Feature schema artifact was not found: {self.feature_schema_path}"
            )

        self.model = joblib.load(self.model_path)
        self.feature_columns = joblib.load(self.feature_schema_path)
        self._validate_artifacts()

    def _validate_artifacts(self) -> None:
        if not isinstance(self.feature_columns, (list, tuple)):
            raise TypeError("Feature schema must be a list or tuple of column names")
        if not all(isinstance(name, str) for name in self.feature_columns):
            raise TypeError("Feature schema column names must be strings")
        if not hasattr(self.model, "predict") or not hasattr(self.model, "predict_proba"):
            raise TypeError("Loaded model must provide predict and predict_proba methods")
        if not hasattr(self.model, "classes_") or 1 not in self.model.classes_:
            raise ValueError("Loaded model must contain a positive failure class labeled 1")
        if hasattr(self.model, "n_features_in_") and (
            self.model.n_features_in_ != len(self.feature_columns)
        ):
            raise ValueError("Feature schema length does not match the trained model")

    def predict(self, sensor_input: dict[str, Any]) -> dict[str, Any]:
        """Return a JSON-serializable failure prediction for one machine."""
        features = build_feature_row(sensor_input, self.feature_columns)
        failure_probability = float(
            self.model.predict_proba(features)[0, list(self.model.classes_).index(1)]
        )
        machine_failure = int(
            failure_probability >= self.classification_threshold
        )

        if failure_probability < self.thresholds.low_upper:
            risk_level = "LOW"
        elif failure_probability <= self.thresholds.medium_upper:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        return {
            "machine_failure": machine_failure,
            "failure_probability": round(failure_probability, 6),
            "risk_level": risk_level,
        }
