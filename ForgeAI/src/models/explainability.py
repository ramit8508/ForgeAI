"""SHAP explanations for the machine-failure predictor."""

from __future__ import annotations

from functools import cached_property
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import shap

from src.features.engineering import build_feature_row
from src.models.inference import MachineFailurePredictor


class ExplainabilityError(RuntimeError):
    """Raised when a prediction cannot be explained reliably."""


class MachineFailureExplainer:
    """Create cached probability-scale SHAP explanations for one predictor."""

    _BACKGROUND_SIZE = 100
    _ADDITIVITY_TOLERANCE = 1e-3

    def __init__(
        self,
        predictor: MachineFailurePredictor,
        background_path: str | Path | None = None,
    ) -> None:
        self.predictor = predictor
        project_root = Path(__file__).resolve().parents[2]
        self.background_path = Path(
            background_path or project_root / "Data" / "Raw" / "ai4i2020.csv"
        )

    @cached_property
    def explainer(self) -> shap.TreeExplainer:
        """Build the probability-scale explainer once per process."""
        try:
            background = self._load_background()
            return shap.TreeExplainer(
                self.predictor.model,
                data=background,
                feature_perturbation="interventional",
                model_output="probability",
            )
        except (OSError, ValueError, TypeError) as error:
            raise ExplainabilityError(
                "The model explanation service could not be initialized."
            ) from error

    def _load_background(self) -> pd.DataFrame:
        if not self.background_path.is_file():
            raise FileNotFoundError("SHAP background data is unavailable")

        raw_data = pd.read_csv(self.background_path, nrows=self._BACKGROUND_SIZE)
        rows = [
            build_feature_row(row.to_dict(), self.predictor.feature_columns)
            for _, row in raw_data.iterrows()
        ]
        if not rows:
            raise ValueError("SHAP background data is empty")
        return pd.concat(rows, ignore_index=True)

    def explain(self, sensor_input: dict[str, Any]) -> dict[str, Any]:
        """Return failure-class SHAP values and probability-scale model values."""
        features = build_feature_row(sensor_input, self.predictor.feature_columns)
        failure_class_index = list(self.predictor.model.classes_).index(1)

        try:
            shap_output = np.asarray(self.explainer.shap_values(features))
            shap_values = self._select_class_values(shap_output, failure_class_index)
            base_value = self._select_class_value(
                np.asarray(self.explainer.expected_value), failure_class_index
            )
            output_value = float(
                self.predictor.model.predict_proba(features)[0, failure_class_index]
            )
        except (IndexError, TypeError, ValueError, RuntimeError, OSError) as error:
            raise ExplainabilityError(
                "The model explanation service could not process the request."
            ) from error

        contribution_sum = base_value + float(shap_values.sum())
        if not np.isclose(
            contribution_sum,
            output_value,
            atol=self._ADDITIVITY_TOLERANCE,
            rtol=self._ADDITIVITY_TOLERANCE,
        ):
            raise ExplainabilityError(
                "The model explanation failed its additivity validation."
            )

        values = features.iloc[0].to_dict()
        explanation_features = [
            {
                "name": name,
                "display_name": self._display_name(name),
                "value": float(values[name]),
                "unit": self._unit(name),
                "shap_value": float(value),
                "direction": "positive" if value >= 0 else "negative",
            }
            for name, value in zip(features.columns, shap_values, strict=True)
        ]
        return {
            "base_value": base_value,
            "output_value": output_value,
            "features": explanation_features,
        }

    @staticmethod
    def _select_class_values(values: np.ndarray, class_index: int) -> np.ndarray:
        if values.ndim == 3:
            if values.shape[0] != 1 or class_index >= values.shape[2]:
                raise ValueError("Unsupported SHAP value shape")
            return values[0, :, class_index]
        if values.ndim == 2:
            if values.shape[0] != 1:
                raise ValueError("Unsupported SHAP value shape")
            return values[0]
        raise ValueError("Unsupported SHAP value shape")

    @staticmethod
    def _select_class_value(values: np.ndarray, class_index: int) -> float:
        if values.ndim == 0:
            return float(values)
        if values.ndim == 1 and class_index < values.shape[0]:
            return float(values[class_index])
        raise ValueError("Unsupported SHAP base value shape")

    @staticmethod
    def _display_name(name: str) -> str:
        return {
            "Air temperature [K]": "Air Temperature",
            "Process temperature [K]": "Process Temperature",
            "Temperature_difference": "Temperature Difference",
            "Rotational speed [rpm]": "Rotational Speed",
            "Torque [Nm]": "Torque",
            "Tool wear [min]": "Tool Wear",
        }.get(name, name)

    @staticmethod
    def _unit(name: str) -> str:
        return {
            "Air temperature [K]": "K",
            "Process temperature [K]": "K",
            "Temperature_difference": "K",
            "Rotational speed [rpm]": "rpm",
            "Torque [Nm]": "Nm",
            "Tool wear [min]": "min",
        }.get(name, "")
