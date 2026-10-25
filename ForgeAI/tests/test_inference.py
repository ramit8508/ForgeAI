from __future__ import annotations

import pytest

from src.models.inference import MachineFailurePredictor, RiskThresholds


NORMAL_INPUT = {
    "Air temperature [K]": 298.1,
    "Process temperature [K]": 308.6,
    "Rotational speed [rpm]": 1551,
    "Torque [Nm]": 42.8,
    "Tool wear [min]": 0,
}

HIGH_RISK_INPUT = {
    "Air temperature [K]": 300.5,
    "Process temperature [K]": 310.7,
    "Rotational speed [rpm]": 1200,
    "Torque [Nm]": 65.0,
    "Tool wear [min]": 220,
}


@pytest.fixture()
def predictor() -> MachineFailurePredictor:
    return MachineFailurePredictor()


def test_normal_input_returns_prediction(predictor: MachineFailurePredictor) -> None:
    result = predictor.predict(NORMAL_INPUT)
    assert set(result) == {"machine_failure", "failure_probability", "risk_level"}
    assert result["machine_failure"] in (0, 1)
    assert 0 <= result["failure_probability"] <= 1
    assert result["machine_failure"] == int(
        result["failure_probability"] >= predictor.classification_threshold
    )
    assert result["risk_level"] in {"LOW", "MEDIUM", "HIGH"}


def test_high_risk_input_returns_prediction(predictor: MachineFailurePredictor) -> None:
    result = predictor.predict(HIGH_RISK_INPUT)
    assert result["failure_probability"] > 0.5
    assert result["machine_failure"] == int(
        result["failure_probability"] >= predictor.classification_threshold
    )


def test_missing_input_is_rejected(predictor: MachineFailurePredictor) -> None:
    invalid_input = dict(NORMAL_INPUT)
    del invalid_input["Torque [Nm]"]
    with pytest.raises(ValueError, match="Missing required"):
        predictor.predict(invalid_input)


def test_invalid_input_is_rejected(predictor: MachineFailurePredictor) -> None:
    invalid_input = dict(NORMAL_INPUT)
    invalid_input["Tool wear [min]"] = -1
    with pytest.raises(ValueError, match="cannot be negative"):
        predictor.predict(invalid_input)


def test_thresholds_are_configurable() -> None:
    thresholds = RiskThresholds(low_upper=0.2, medium_upper=0.6)
    assert thresholds.low_upper == 0.2


def test_classification_threshold_is_configurable() -> None:
    predictor = MachineFailurePredictor(classification_threshold=0.45)
    result = predictor.predict(HIGH_RISK_INPUT)
    assert predictor.classification_threshold == 0.45
    assert result["machine_failure"] == int(result["failure_probability"] >= 0.45)
