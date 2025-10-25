from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionInput(BaseModel):
    gender: str
    age: float
    occupation: str
    sleepDuration: float
    sleepQuality: float
    physicalActivityLevel: float
    stressLevel: float
    bmiCategory: str
    heartRate: float
    dailySteps: float
    systolicBP: float
    diastolicBP: float


class PredictionOutput(BaseModel):
    predictedSleep: str