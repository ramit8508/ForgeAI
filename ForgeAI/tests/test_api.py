from __future__ import annotations

import src.api.app as app_module
from fastapi.testclient import TestClient
import pytest

from src.api.app import app


client = TestClient(app)

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


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_normal_machine_prediction() -> None:
    response = client.post("/predict", json=NORMAL_INPUT)
    body = response.json()
    assert response.status_code == 200
    assert set(body) == {"machine_failure", "failure_probability", "risk_level"}
    assert body["machine_failure"] in (0, 1)
    assert 0 <= body["failure_probability"] <= 1
    assert body["machine_failure"] == int(body["failure_probability"] >= 0.45)
    assert body["risk_level"] in {"LOW", "MEDIUM", "HIGH"}


def test_high_risk_machine_prediction() -> None:
    response = client.post("/predict", json=HIGH_RISK_INPUT)
    body = response.json()
    assert response.status_code == 200
    assert body["failure_probability"] > 0.70
    assert body["machine_failure"] == int(body["failure_probability"] >= 0.45)
    assert body["risk_level"] == "HIGH"


def test_invalid_machine_input_returns_client_error() -> None:
    invalid_input = dict(HIGH_RISK_INPUT)
    invalid_input["Torque [Nm]"] = -10
    response = client.post("/predict", json=invalid_input)
    assert response.status_code == 422


def test_explain_endpoint_returns_probability_scale_feature_contributions() -> None:
    response = client.post("/predict/explain", json=NORMAL_INPUT)

    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"base_value", "output_value", "features"}
    assert 0 <= body["base_value"] <= 1
    assert 0 <= body["output_value"] <= 1
    assert [feature["name"] for feature in body["features"]] == [
        "Air temperature [K]",
        "Process temperature [K]",
        "Temperature_difference",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]",
    ]
    assert all(
        set(feature)
        == {"name", "display_name", "value", "unit", "shap_value", "direction"}
        for feature in body["features"]
    )
    assert all(
        feature["direction"] in {"positive", "negative"}
        for feature in body["features"]
    )


def test_explain_endpoint_uses_failure_class_probability() -> None:
    explanation = client.post("/predict/explain", json=NORMAL_INPUT).json()
    prediction = client.post("/predict", json=NORMAL_INPUT).json()

    assert explanation["output_value"] == pytest.approx(
        prediction["failure_probability"], abs=0.000001
    )
    assert abs(
        explanation["base_value"]
        + sum(feature["shap_value"] for feature in explanation["features"])
        - explanation["output_value"]
    ) <= 0.0011


def test_invalid_explain_input_returns_client_error() -> None:
    invalid_input = dict(NORMAL_INPUT)
    invalid_input["Torque [Nm]"] = -10

    response = client.post("/predict/explain", json=invalid_input)

    assert response.status_code == 422


def test_explain_endpoint_hides_explainer_failures(monkeypatch) -> None:
    class BrokenExplainer:
        def explain(self, sensor_input: dict) -> dict:
            raise app_module.ExplainabilityError("internal detail")

    monkeypatch.setattr(app_module, "explainer", BrokenExplainer())

    response = client.post("/predict/explain", json=NORMAL_INPUT)

    assert response.status_code == 500
    assert response.json() == {
        "detail": "The prediction explanation service could not process the request."
    }
