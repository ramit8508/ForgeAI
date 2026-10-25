"""Run the inference pipeline with normal, high-risk, and invalid inputs."""

from __future__ import annotations

from src.models.inference import MachineFailurePredictor


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


def print_prediction(name: str, predictor: MachineFailurePredictor, sensor_input: dict) -> None:
    result = predictor.predict(sensor_input)
    status = "YES" if result["machine_failure"] else "NO"
    print(f"\n{name}")
    print(f"Machine Failure: {status}")
    print(f"Failure Probability: {result['failure_probability']:.2%}")
    print(f"Risk Level: {result['risk_level']}")


def main() -> None:
    predictor = MachineFailurePredictor()
    print_prediction("Normal machine", predictor, NORMAL_INPUT)
    print_prediction("High-risk machine", predictor, HIGH_RISK_INPUT)

    invalid_input = dict(NORMAL_INPUT)
    invalid_input["Torque [Nm]"] = -1
    try:
        predictor.predict(invalid_input)
    except ValueError as error:
        print(f"\nInvalid machine input rejected: {error}")


if __name__ == "__main__":
    main()
