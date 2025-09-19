import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  FileDown, 
  ArrowLeft, 
  Droplets, 
  Calculator, 
  MapPin, 
  Image as ImageIcon,
  IndianRupee,
  Calendar,
  Home
} from 'lucide-react';
import { UserData } from '../App';
import { toast } from 'sonner@2.0.3';

interface ResultsPageProps {
  userData: UserData;
  onBack: () => void;
}

export function ResultsPage({ userData, onBack }: ResultsPageProps) {
  const generatePDF = async () => {
    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with line breaks
      const addText = (text: string, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        doc.text(text, margin, yPosition);
        yPosition += fontSize * 0.5 + 5;
      };

      // Title
      addText('Rainwater Harvesting Assessment Report', 18, true);
      yPosition += 10;

      // Personal Information
      addText('Personal Information', 14, true);
      addText(`Name: ${userData.name}`);
      addText(`Mobile: ${userData.mobile}`);
      addText(`Email: ${userData.email}`);
      yPosition += 10;

      // Location Information
      addText('Location Information', 14, true);
      addText(`Location: ${userData.analysisResults?.location || 'Unknown'}`);
      addText(`Coordinates: ${userData.latitude?.toFixed(6)}, ${userData.longitude?.toFixed(6)}`);
      yPosition += 10;

      // Analysis Results
      addText('Analysis Results', 14, true);
      addText(`Rooftop Area: ${userData.rooftopArea} sq meters`);
      addText(`Average Annual Rainfall: ${userData.analysisResults?.averageRainfall} mm`);
      addText(`Recommended Tank Size: ${userData.analysisResults?.recommendedTankSize} liters`);
      addText(`Monthly Storage Potential: ${userData.analysisResults?.monthlyStorage} liters`);
      addText(`Estimated Construction Cost: ₹${userData.analysisResults?.constructionCost?.toLocaleString()}`);
      yPosition += 10;

      // Add rooftop image if available
      if (userData.rooftopImage) {
        try {
          // Convert image to fit in PDF
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = 80;
          
          if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }
          
          addText('Rooftop Image', 14, true);
          doc.addImage(userData.rooftopImage, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (imgError) {
          console.warn('Could not add image to PDF:', imgError);
          addText('Rooftop Image: [Image could not be included in PDF]');
        }
      }

      // Footer
      yPosition = doc.internal.pageSize.getHeight() - 30;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      doc.text('Rainwater Harvesting Calculator', pageWidth - margin - 60, yPosition);

      // Save the PDF
      doc.save(`rainwater-harvesting-report-${userData.name.replace(/\s+/g, '-')}.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl">Assessment Results</h1>
              <p className="text-muted-foreground">Comprehensive rainwater harvesting analysis for {userData.name}</p>
            </div>
          </div>
          
          <Button 
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <FileDown className="w-5 h-5 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Annual Rainfall</p>
                      <p className="text-3xl">{userData.analysisResults?.averageRainfall} mm</p>
                    </div>
                    <Droplets className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Tank Capacity</p>
                      <p className="text-3xl">{userData.analysisResults?.recommendedTankSize}L</p>
                    </div>
                    <Home className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Monthly Storage</p>
                      <p className="text-3xl">{userData.analysisResults?.monthlyStorage}L</p>
                    </div>
                    <Calendar className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Construction Cost</p>
                      <p className="text-3xl">₹{userData.analysisResults?.constructionCost?.toLocaleString()}</p>
                    </div>
                    <IndianRupee className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="mb-3">Technical Specifications</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rooftop Area:</span>
                        <span>{userData.rooftopArea} sq meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collection Efficiency:</span>
                        <span>80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Collection:</span>
                        <span>{((userData.rooftopArea || 0) * (userData.analysisResults?.averageRainfall || 0) * 0.8).toLocaleString()} liters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost per Sq Meter:</span>
                        <span>₹{Math.floor((userData.analysisResults?.constructionCost || 0) / (userData.rooftopArea || 1))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3">Location Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City:</span>
                        <span>{userData.analysisResults?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latitude:</span>
                        <span>{userData.latitude?.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Longitude:</span>
                        <span>{userData.longitude?.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Climate Zone:</span>
                        <span>
                          <Badge variant="secondary">
                            {(userData.analysisResults?.averageRainfall || 0) > 1000 ? 'High Rainfall' : 'Moderate Rainfall'}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Recommendations</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        <strong>Primary Recommendation:</strong> Install a {userData.analysisResults?.recommendedTankSize}L capacity tank 
                        to capture and store rainwater efficiently for your {userData.rooftopArea} sq meter rooftop.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">
                        <strong>Cost-Benefit Analysis:</strong> With an estimated construction cost of 
                        ₹{userData.analysisResults?.constructionCost?.toLocaleString()}, you can potentially save 
                        {userData.analysisResults?.monthlyStorage} liters per month on your water bills.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-purple-800">
                        <strong>Maintenance Tips:</strong> Regular cleaning of gutters and first-flush diverters 
                        will ensure optimal water quality and system efficiency.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Personal Info & Image */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Assessment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Full Name</h4>
                  <p>{userData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Contact Information</h4>
                  <p className="text-sm">{userData.mobile}</p>
                  <p className="text-sm">{userData.email}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Assessment Date</h4>
                  <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rooftop Image */}
            {userData.rooftopImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Analyzed Rooftop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={userData.rooftopImage}
                    alt="Analyzed rooftop"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    AI-analyzed rooftop area: {userData.rooftopArea} sq meters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}