from __future__ import annotations

from fastapi.testclient import TestClient

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
