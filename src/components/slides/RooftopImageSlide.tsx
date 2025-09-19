import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Camera, Upload, Image, Loader2, CheckCircle, X, RotateCcw } from 'lucide-react';
import { UserData } from '../../App';
import { toast } from 'sonner@2.0.3';

interface RooftopImageSlideProps {
  formData: UserData;
  onComplete: (data: Partial<UserData>) => void;
  onPrevious?: () => void;
}

export function RooftopImageSlide({ formData, onComplete }: RooftopImageSlideProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(formData.rooftopImage || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    startCamera();
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    toast.success('Image analysis completed successfully!');
    
    // Complete the form after a short delay to show the success state
    setTimeout(() => {
      onComplete({
        rooftopImage: selectedImage,
      });
    }, 1500);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      toast.success('Camera activated successfully!');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageData);
        stopCamera();
        toast.success('Photo captured successfully!');
      }
    }
  };

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="p-8 h-full flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Rooftop Analysis</CardTitle>
          <p className="text-muted-foreground">
            Upload or capture an image of your rooftop for AI-powered area analysis
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Camera Interface */}
          {showCamera && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <Button
                    onClick={stopCamera}
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={capturePhoto}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                    size="sm"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm text-center">
                  Position your phone above the rooftop and tap Capture when ready
                </p>
              </div>
            </div>
          )}

          {!selectedImage && !showCamera && (
            <>
              {/* Camera Capture */}
              <div className="space-y-4">
                <Button
                  onClick={handleCameraCapture}
                  variant="outline"
                  className="w-full py-8 border-2 border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                  size="lg"
                >
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <p className="text-lg">Use Camera</p>
                    <p className="text-sm text-muted-foreground">Take a photo of your rooftop</p>
                  </div>
                </Button>
              </div>

              <Separator />

              {/* File Upload */}
              <div className="space-y-4">
                <Button
                  onClick={handleFileUpload}
                  variant="outline"
                  className="w-full py-8 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                  size="lg"
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg">Upload Image</p>
                    <p className="text-sm text-muted-foreground">Choose from your device</p>
                  </div>
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Tips for best results:</strong>
                  <br />• Take the photo from directly above the rooftop
                  <br />• Ensure good lighting and clear visibility
                  <br />• Include the entire rooftop area in the frame
                  <br />• Avoid shadows and obstructions
                </p>
              </div>
            </>
          )}

          {selectedImage && (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Rooftop preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
                {!isAnalyzing && !analysisComplete && (
                  <div className="absolute top-2 right-2 space-x-2">
                    <Button
                      onClick={() => {
                        removeImage();
                        startCamera();
                      }}
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-black"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={removeImage}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                  <h3 className="text-lg mb-2">Analyzing Rooftop Image</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing your rooftop to calculate the area and water collection potential...
                  </p>
                </div>
              )}

              {analysisComplete && (
                <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg mb-2">Analysis Complete!</h3>
                  <p className="text-muted-foreground">
                    Your rooftop has been successfully analyzed. Preparing your detailed report...
                  </p>
                </div>
              )}

              {/* Analyze Button */}
              {!isAnalyzing && !analysisComplete && (
                <Button
                  onClick={analyzeImage}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
                  size="lg"
                >
                  <Image className="w-5 h-5 mr-2" />
                  Analyze Rooftop Image
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}