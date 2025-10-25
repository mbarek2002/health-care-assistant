import Navbar from "@/components/Navbar";
import { apiService, PredictionHistoryItem, PredictionInputApi, PredictionOutputApi } from "@/services/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
    const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
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

    const loadHistory = async () => {
        try {
            const items = await apiService.listPredictions();
            setHistory(items);
        } catch (e) {
            console.error('Failed to load predictions history', e);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleInputChange = (field: keyof PredictionRequest, value: any) => {
        setPredictionResquest(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const InfoPill: React.FC<{ label: string; value: number | string | undefined }> = ({ label, value }) => (
        <div className="px-2 py-1 rounded bg-primary border border-slate-700/50 flex items-center justify-between">
            <span className="text-gray-200">{label}</span>
            <span className="font-medium text-gray-200 ml-2">{value ?? '-'}</span>
        </div>
    );


    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Sleep Disorder Detection</h1>
                    <p className="text-muted-foreground">
                        Discover potential sleep disorders with our advanced detection tool. By analyzing key health and lifestyle factors, we provide insights to help you improve your sleep quality and overall well-being.
                    </p>
                </div>

                {/* Prediction Form */}
                <Card className="p-6 mb-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground">Person Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={predictionRequest.gender}
                                onValueChange={(value) => handleInputChange("gender", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Age */}
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={predictionRequest.age || ''}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                                min="0"
                                placeholder="Enter age"
                            />
                        </div>
                        {/* Occupation */}
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Select
                                value={predictionRequest.occupation}
                                onValueChange={(value) => handleInputChange("occupation", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select occupation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SoftwareEngineer">Software Engineer</SelectItem>
                                    <SelectItem value="Doctor">Doctor</SelectItem>
                                    <SelectItem value="SalesRepresentative">Sales Representative</SelectItem>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                    <SelectItem value="Nurse">Nurse</SelectItem>
                                    <SelectItem value="Engineer">Engineer</SelectItem>
                                    <SelectItem value="Accountant">Accountant</SelectItem>
                                    <SelectItem value="Lawyer">Lawyer</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Salesperson">Salesperson</SelectItem>
                                    <SelectItem value="Scientist">Scientist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* sleepDuration */}
                        <div className="space-y-2">
                            <Label htmlFor="sleepDuration">Sleep Duration</Label>
                            <Input
                                id="sleepDuration"
                                type="number"
                                value={predictionRequest.sleepDuration || ''}
                                onChange={(e) => handleInputChange("sleepDuration", e.target.value)}
                                min="0"
                                placeholder="Hours of sleep"
                            />
                        </div>
                        {/* sleepQuality */}
                        <div className="space-y-2">
                            <Label htmlFor="sleepQuality">Sleep Quality</Label>
                            <Input
                                id="sleepQuality"
                                type="number"
                                value={predictionRequest.sleepQuality || ''}
                                onChange={(e) => handleInputChange("sleepQuality", e.target.value)}
                                min="0"
                                placeholder="Quality rating (1-10)"
                            />
                        </div>
                        {/* physicalActivityLevel */}
                        <div className="space-y-2">
                            <Label htmlFor="physicalActivityLevel">Physical Activity Level</Label>
                            <Input
                                id="physicalActivityLevel"
                                type="number"
                                value={predictionRequest.physicalActivityLevel || ''}
                                onChange={(e) => handleInputChange("physicalActivityLevel", e.target.value)}
                                min="0"
                                placeholder="Activity level (1-10)"
                            />
                        </div>
                        {/* stressLevel */}
                        <div className="space-y-2">
                            <Label htmlFor="stressLevel">Stress Level</Label>
                            <Input
                                id="stressLevel"
                                type="number"
                                value={predictionRequest.stressLevel || ''}
                                onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                                min="0"
                                placeholder="Stress level (1-10)"
                            />
                        </div>

                        {/* bmiCategory */}
                        <div className="space-y-2">
                            <Label htmlFor="bmiCategory">BMI Category</Label>
                            <Select
                                value={predictionRequest.bmiCategory}
                                onValueChange={(value) => handleInputChange("bmiCategory", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select BMI category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Overweight">Overweight</SelectItem>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Obese">Obese</SelectItem>
                                    <SelectItem value="NormalWeight">Normal Weight</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* heartRate */}
                        <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate</Label>
                            <Input
                                id="heartRate"
                                type="number"
                                value={predictionRequest.heartRate || ''}
                                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                                min="0"
                                placeholder="BPM"
                            />
                        </div>
                        {/* dailySteps */}
                        <div className="space-y-2">
                            <Label htmlFor="dailySteps">Daily Steps</Label>
                            <Input
                                id="dailySteps"
                                type="number"
                                value={predictionRequest.dailySteps || ''}
                                onChange={(e) => handleInputChange("dailySteps", e.target.value)}
                                min="0"
                                placeholder="Steps per day"
                            />
                        </div>

                        {/* systolicBP */}
                        <div className="space-y-2">
                            <Label htmlFor="systolicBP">Systolic BP</Label>
                            <Input
                                id="systolicBP"
                                type="number"
                                value={predictionRequest.systolicBP || ''}
                                onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                                min="0"
                                placeholder="mmHg"
                            />
                        </div>

                        {/* diastolicBP */}
                        <div className="space-y-2">
                            <Label htmlFor="diastolicBP">Diastolic BP</Label>
                            <Input
                                id="diastolicBP"
                                type="number"
                                value={predictionRequest.diastolicBP || ''}
                                onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                                min="0"
                                placeholder="mmHg"
                            />
                        </div>
                    </div>

                    {/* Predict Button */}
                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={handlePredict}
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Analyzing Data...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Get Sleep Disorder Analysis</span>
                                </div>
                            )}
                        </Button>
                    </div>
                    {/* Error Display */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
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
                        <div className="space-y-6">
                            {/* Main Prediction Card */}
                            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                                <div className="text-center space-y-6">
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-foreground">Predicted Sleep Disorder</h3>
                                    </div>
                                    <div className="text-6xl font-bold text-primary">
                                        {prediction.predictedSleep}
                                    </div>
                                    <div className="flex items-center justify-center space-x-6 text-sm">
                                        <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-full">
                                            <span className="text-muted-foreground">This is a statistical model estimate.</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Disclaimer */}
                            <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                                <div className="flex items-start space-x-2">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-yellow-800">Disclaimer</p>
                                        <p className="text-yellow-700 text-sm">This prediction is generated by a trained model on your inputs. Actual sleep disorder diagnosis should be confirmed by a healthcare professional.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                </Card>

                {/* Predictions History */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        {/* <div className="w-8 h-8 bg-teal-500 rounded-lg grid place-items-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M5 11h14M5 19h14M5 15h14" />
                            </svg>
                        </div> */}
                        <h3 className="text-2xl font-semibold">Recent Predictions</h3>
                    </div>
                    {history.length === 0 ? (
                        <div className="card glass p-6 text-gray-300">No predictions yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {history.map((item) => (
                                <div key={item._id} className="card glass p-5 border border-slate-700/50 hover-lift">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-sm text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
                                            <div className="text-2xl font-bold gradient-text mt-1">
                                                {item.predicted_sleep_discord}
                                                {/* {formatPrice(item.predicted_price)} */}

                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center">
                                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M3 13h18l-1.5-3.75a4 4 0 0 0-3.7-2.5H8.2a4 4 0 0 0-3.7 2.5L3 13z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-300">
                                        <InfoPill label="Gender" value={item.gender} />
                                        <InfoPill label="Age" value={item.age} />
                                        <InfoPill label="Occupation" value={item.occupation} />
                                        <InfoPill label="Physical Activity Level" value={item.physicalActivityLevel} />
                                        <InfoPill label="Daily Steps" value={item.dailySteps} />
                                        <InfoPill label="BMI Category" value={item.bmiCategory} />
                                        <InfoPill label="Diastolic_BP" value={item.diastolicBP} />
                                        <InfoPill label="Sleep Duration" value={item.sleepDuration} />
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </main>
        </div>
    )


}
export default SleepDiscorderDetectionPage;