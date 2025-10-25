import Navbar from "@/components/Navbar";
import { apiService, PredictionInputApi, PredictionOutputApi } from "@/services/api";
import { useState } from "react";


interface PredictionRequest {
    gender: string;
    age: number;
    occupation: string;
    sleepDuration: number;
    sleepQuality: number;
    physicalActivityLevel: number;
    stressLevel: number;
    bmiCategory: string;
    heartRate: number;
    dailySteps: number;
    systolicBP: number;
    diastolicBP: number;
}

interface PredictionResponse {
    predictedSleep: string;
}


const SleepDiscorderDetectionPage: React.FC = () => {


    const [predictionRequest, setPredictionResquest] = useState<PredictionRequest>({
        gender: "Male",
        age: null,
        occupation: "Engineer",
        sleepDuration: null,
        sleepQuality: null,
        physicalActivityLevel: null,
        stressLevel: null,
        bmiCategory: "Normal",
        heartRate: null,
        dailySteps: null,
        systolicBP: null,
        diastolicBP: null
    })

    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [history, setHistory] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handlePredict = async () => {
        if (!predictionRequest.sleepDuration) {
            setError('Please enter a car model');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Map UI fields to backend PredictionInputApi
            const payload: PredictionInputApi = predictionRequest;
            const res: PredictionOutputApi = await apiService.predictPrice(payload);
            setPrediction({ predictedSleep: res.predictedSleep });
            // refresh history after new prediction
            // loadHistory();
        } catch (err: any) {
            console.error('Prediction error:', err);
            setError('Failed to get price prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof PredictionRequest, value: any) => {
        setPredictionResquest(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                {/* Header  */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-slow">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold gradient-text">
                        Sleep Discorder Detection
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover potential sleep disorders with our advanced detection tool. By analyzing key health and lifestyle factors, we provide insights to help you improve your sleep quality and overall well-being.
                    </p>
                </div>

                {/* Prediction Form */}
                <div className="card glass p-8 animate-slide-in-right">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-primary ">Person Information </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Gender */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Gender
                            </label>
                            <select
                                value={predictionRequest.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        {/* Age */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Age
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.age || ''}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />

                        </div>
                        {/* Occupation */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Occupation
                            </label>
                            <select
                                value={predictionRequest.gender}
                                onChange={(e) => handleInputChange("occupation", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="SoftwareEngineer">Software Engineer</option>
                                <option value="Doctor">Doctor</option>
                                <option value="SalesRepresentative">Sales Representative</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Engineer">Engineer</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Lawyer">Lawyer</option>
                                <option value="Manager">Manager</option>
                                <option value="Salesperson">Salesperson</option>
                                <option value="Scientist">Scientist</option>
                            </select>
                        </div>
                        {/* sleepDuration */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                sleep Duration
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.sleepDuration || ''}
                                onChange={(e) => handleInputChange("sleepDuration", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />

                        </div>
                        {/* sleepQuality */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                sleep Quality
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.sleepQuality || ''}
                                onChange={(e) => handleInputChange("sleepQuality", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>
                        {/* physicalActivityLevel */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                physical Activity Level
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.physicalActivityLevel || ''}
                                onChange={(e) => handleInputChange("physicalActivityLevel", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>
                        {/* stressLevel */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Stresse Level
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.stressLevel || ''}
                                onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>

                        {/* bmiCategory */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                bmi Category
                            </label>
                            <select
                                value={predictionRequest.bmiCategory}
                                onChange={(e) => handleInputChange("bmiCategory", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Overweight">Overweight</option>
                                <option value="Normal">Normal</option>
                                <option value="Obese">Obese</option>
                                <option value="NormalWeight">Normal Weight</option>
                            </select>
                        </div>
                        {/* heartRate */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                heart Rate
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.heartRate || ''}
                                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>
                        {/* dailySteps */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Daily Steps
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.dailySteps || ''}
                                onChange={(e) => handleInputChange("dailySteps", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>

                        {/* systolicBP */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                Systolic BP
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.systolicBP || ''}
                                onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>

                        {/* diastolicBP */}
                        <div className=" space-y-2 ">
                            <label className="block text-sm font-medium text-gray-500">
                                diastolic BP
                            </label>
                            <input
                                type="number"
                                value={predictionRequest.diastolicBP || ''}
                                onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Predict Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handlePredict}
                            disabled={loading}
                        >
                            {
                                loading ?
                                    (<div className="flex items-center space-x-3">
                                        <div className="spinner" />
                                        <span>Analyzing Market Data...</span>
                                    </div>) :
                                    (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Get Sleep Discorder </span>
                                        </div>
                                    )
                            }

                        </button>
                    </div>
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Prediction Results */}
                    {prediction && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Main Prediction Card */}
                            <div className="card glass p-8 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30">
                                <div className="text-center space-y-6">
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white">Predicted Market Value</h3>
                                    </div>
                                    <div className="text-6xl font-bold gradient-text">
                                        {prediction.predictedSleep}
                                        {/* {formatPrice(prediction.predictedPrice)} */}
                                    </div>
                                    <div className="flex items-center justify-center space-x-6 text-sm">
                                        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full">
                                            <span className="text-gray-300">This is a statistical model estimate.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-200 text-sm">
                                <div className="flex items-start space-x-2">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Disclaimer</p>
                                        <p>This prediction is generated by a trained model on your inputs. Actual prices may vary based on local market conditions, vehicle history, and other factors not considered in this analysis.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}




                </div>

            </div>
        </div>
    )


}
export default SleepDiscorderDetectionPage;