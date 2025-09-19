import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalInfoSlide } from './slides/PersonalInfoSlide';
import { LocationSlide } from './slides/LocationSlide';
import { RooftopImageSlide } from './slides/RooftopImageSlide';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ChevronLeft, X } from 'lucide-react';
import { UserData } from '../App';

interface ExaminationFormProps {
  onComplete: (data: UserData) => void;
  onBack: () => void;
}

export function ExaminationForm({ onComplete, onBack }: ExaminationFormProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    mobile: '',
    email: '',
    latitude: null,
    longitude: null,
    rooftopImage: null,
    rooftopArea: null,
  });

  const slides = [
    { id: 0, title: 'Personal Information', component: PersonalInfoSlide },
    { id: 1, title: 'Location Detection', component: LocationSlide },
    { id: 2, title: 'Rooftop Analysis', component: RooftopImageSlide },
  ];

  const progress = ((currentSlide + 1) / slides.length) * 100;

  const handleSlideComplete = (data: Partial<UserData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Final slide completed, perform AI analysis and calculations
      performAnalysis(updatedData);
    }
  };

  const performAnalysis = async (data: UserData) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis based on image and location
    const mockRooftopArea = Math.floor(Math.random() * 500) + 100; // 100-600 sq meters
    const mockRainfall = getRainfallByLocation(data.latitude, data.longitude);
    
    const analysisResults = {
      averageRainfall: mockRainfall,
      recommendedTankSize: Math.floor(mockRooftopArea * 0.8 * mockRainfall * 0.001), // Conservative calculation
      monthlyStorage: Math.floor(mockRooftopArea * mockRainfall * 0.8 / 12), // Monthly average
      constructionCost: estimateConstructionCost(mockRooftopArea),
      location: await getLocationName(data.latitude, data.longitude),
    };

    const finalData = {
      ...data,
      rooftopArea: mockRooftopArea,
      analysisResults,
    };

    onComplete(finalData);
  };

  // Mock rainfall data based on coordinates
  const getRainfallByLocation = (lat: number | null, lng: number | null): number => {
    if (!lat || !lng) return 800; // Default fallback
    
    // Simulate different rainfall zones
    const baseRainfall = 600;
    const latitudeBonus = Math.abs(lat) < 30 ? 400 : 200; // Tropical regions get more rain
    const coastalBonus = Math.random() * 300; // Random coastal effect
    
    return Math.floor(baseRainfall + latitudeBonus + coastalBonus);
  };

  // Mock location name lookup
  const getLocationName = async (lat: number | null, lng: number | null): Promise<string> => {
    if (!lat || !lng) return 'Unknown Location';
    
    // Mock location names based on coordinates
    const mockLocations = [
      'Mumbai, Maharashtra',
      'Bangalore, Karnataka',
      'Chennai, Tamil Nadu',
      'Delhi, Delhi',
      'Hyderabad, Telangana',
      'Pune, Maharashtra',
      'Kolkata, West Bengal',
    ];
    
    return mockLocations[Math.floor(Math.random() * mockLocations.length)];
  };

  const estimateConstructionCost = (area: number): number => {
    // Mock cost calculation: ₹150-300 per sq meter
    const costPerSqMeter = Math.floor(Math.random() * 150) + 150;
    return area * costPerSqMeter;
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={currentSlide === 0 ? onBack : handlePrevious}
              className="p-2"
            >
              {currentSlide === 0 ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-2xl">Rainwater Harvesting Assessment</h1>
              <p className="text-muted-foreground">Step {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Slide Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CurrentSlideComponent
                formData={formData}
                onComplete={handleSlideComplete}
                onPrevious={currentSlide > 0 ? handlePrevious : undefined}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}