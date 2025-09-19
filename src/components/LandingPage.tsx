import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Droplets, Calculator, FileDown, Camera, MapPin, Users } from 'lucide-react';

interface LandingPageProps {
  onStartExamination: () => void;
}

export function LandingPage({ onStartExamination }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1720281278492-79079cd05c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlud2F0ZXIlMjBoYXJ2ZXN0aW5nJTIwbW9kZXJuJTIwaG91c2V8ZW58MXx8fHwxNzU4Mjg5NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern house with rainwater harvesting system"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="mb-8">
            <Droplets className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h1 className="text-5xl md:text-6xl mb-6">
              Rainwater Harvesting Calculator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover your rooftop's potential for sustainable water collection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-200">
                  Upload your rooftop image for intelligent area calculation
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="mb-2">Location Based</h3>
                <p className="text-sm text-gray-200">
                  Precise calculations based on your local rainfall data
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <FileDown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="mb-2">Detailed Report</h3>
                <p className="text-sm text-gray-200">
                  Download comprehensive PDF reports with all calculations
                </p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={onStartExamination}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Calculator className="w-6 h-6 mr-3" />
            Start Examination
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our intelligent system analyzes your rooftop and location to provide accurate rainwater harvesting calculations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1727637598483-0c139a8fb48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHdhdGVyJTIwY29sbGVjdGlvbiUyMHJvb2Z8ZW58MXx8fHwxNzU4Mjg5NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Sustainable water collection system"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    Provide your basic details to personalize your rainwater harvesting analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Location Detection</h3>
                  <p className="text-muted-foreground">
                    Automatic location detection or manual coordinate entry for accurate rainfall data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">Rooftop Analysis</h3>
                  <p className="text-muted-foreground">
                    AI-powered image analysis to calculate your rooftop area and water collection potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}