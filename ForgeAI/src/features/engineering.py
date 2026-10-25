"""Feature preparation for machine-failure inference."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
import math
from numbers import Real
from typing import Any

import pandas as pd

RAW_FEATURES = (
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
)

ENGINEERED_FEATURE = "Temperature_difference"


def build_feature_row(
    sensor_input: Mapping[str, Any],
    feature_columns: Sequence[str],
) -> pd.DataFrame:
    """Validate sensor data and return one model-ready feature row."""
    missing = [name for name in RAW_FEATURES if name not in sensor_input]
    if missing:
        raise ValueError(f"Missing required sensor values: {', '.join(missing)}")

    values: dict[str, float] = {}
    for name in RAW_FEATURES:
        value = sensor_input[name]
        if isinstance(value, bool) or not isinstance(value, Real):
            raise ValueError(f"{name} must be a finite numeric value")
        numeric_value = float(value)
        if not math.isfinite(numeric_value):
            raise ValueError(f"{name} must be a finite numeric value")
        values[name] = numeric_value

    if values["Air temperature [K]"] <= 0:
        raise ValueError("Air temperature [K] must be greater than zero")
    if values["Process temperature [K]"] <= 0:
        raise ValueError("Process temperature [K] must be greater than zero")
    if values["Process temperature [K]"] < values["Air temperature [K]"]:
        raise ValueError("Process temperature [K] cannot be below air temperature")
    if values["Rotational speed [rpm]"] < 0:
        raise ValueError("Rotational speed [rpm] cannot be negative")
    if values["Torque [Nm]"] < 0:
        raise ValueError("Torque [Nm] cannot be negative")
    if values["Tool wear [min]"] < 0:
        raise ValueError("Tool wear [min] cannot be negative")

    values[ENGINEERED_FEATURE] = (
        values["Process temperature [K]"] - values["Air temperature [K]"]
    )

    expected_columns = list(feature_columns)
    if len(expected_columns) != len(set(expected_columns)):
        raise ValueError("Saved feature schema contains duplicate columns")
    if set(expected_columns) != set(values):
        raise ValueError(
            "Saved feature schema does not match the inference features: "
            f"expected {expected_columns}, available {list(values)}"
        )

    return pd.DataFrame([[values[name] for name in expected_columns]], columns=expected_columns)
