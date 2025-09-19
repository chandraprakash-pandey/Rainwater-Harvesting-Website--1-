import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ExaminationForm } from './components/ExaminationForm';
import { ResultsPage } from './components/ResultsPage';
import { Toaster } from './components/ui/sonner';

export interface UserData {
  name: string;
  mobile: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  rooftopImage: string | null;
  rooftopArea: number | null;
  analysisResults?: {
    averageRainfall: number;
    recommendedTankSize: number;
    monthlyStorage: number;
    constructionCost: number;
    location: string;
  };
}

type AppState = 'landing' | 'examination' | 'results';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    mobile: '',
    email: '',
    latitude: null,
    longitude: null,
    rooftopImage: null,
    rooftopArea: null,
  });

  const handleStartExamination = () => {
    setCurrentState('examination');
  };

  const handleExaminationComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState('results');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setUserData({
      name: '',
      mobile: '',
      email: '',
      latitude: null,
      longitude: null,
      rooftopImage: null,
      rooftopArea: null,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {currentState === 'landing' && (
        <LandingPage onStartExamination={handleStartExamination} />
      )}
      
      {currentState === 'examination' && (
        <ExaminationForm 
          onComplete={handleExaminationComplete}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentState === 'results' && (
        <ResultsPage 
          userData={userData}
          onBack={handleBackToLanding}
        />
      )}
    </div>
  );
}