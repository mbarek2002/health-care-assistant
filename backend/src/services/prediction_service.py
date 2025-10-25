from src.repositories.prediction_repository import PredictionRepository
from src.schemas.prediction_schema import PredictionInput, PredictionOutput
import joblib
import numpy as np
from fastapi import HTTPException
import os
import pandas as pd
import warnings
import pickle
from catboost import CatBoostClassifier, Pool


class PredictionService:
    def __init__(self, db):
        self.repository = PredictionRepository(db)
        model_path = "src/models/catBoost.keras"
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file '{model_path}' not found")
        
        self.model = CatBoostClassifier()

        self.model = self.model.load_model(model_path)


    def predict(self , data : PredictionInput) -> PredictionOutput:
        try:
            
            features =[
                    "Gender",
                    "Age",
                    "Occupation",
                    "Sleep Duration",
                    "Quality of Sleep",
                    "Physical Activity Level",
                    "Stress Level",
                    "BMI Category",
                    "Heart Rate",
                    "Daily Steps",
                    "Systolic_BP",           
                    "Diastolic_BP", 
                ]

            test_data = pd.DataFrame([{
                    "Gender": data.gender,
                    "Age": data.age,
                    "Occupation": data.occupation,
                    "Sleep Duration": data.sleepDuration,
                    "Quality of Sleep": data.sleepQuality,
                    "Physical Activity Level": data.physicalActivityLevel,
                    "Stress Level": data.stressLevel,
                    "BMI Category": data.bmiCategory,
                    "Heart Rate": data.heartRate,
                    "Daily Steps": data.dailySteps,
                    "Systolic_BP": data.systolicBP,           
                    "Diastolic_BP": data.diastolicBP, 
                }])
            
            # print(test_data)
            test_data = test_data[features]
            prediction = self.model.predict(test_data)
            predicted_sleep_discord = str(prediction[0][0])
            
            if predicted_sleep_discord =='None':
                predicted_sleep_discord = 'No Sleep Disorder Detected'
            
            self.repository.save_prediction(data.dict(), predicted_sleep_discord)
            
            return PredictionOutput(predictedSleep=predicted_sleep_discord)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def get_all_predictions(self):
        return self.repository.get_all_predictions()