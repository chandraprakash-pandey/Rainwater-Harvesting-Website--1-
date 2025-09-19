import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Phone, Mail, ArrowRight } from 'lucide-react';
import { UserData } from '../../App';
import { toast } from 'sonner@2.0.3';

interface PersonalInfoSlideProps {
  formData: UserData;
  onComplete: (data: Partial<UserData>) => void;
  onPrevious?: () => void;
}

export function PersonalInfoSlide({ formData, onComplete }: PersonalInfoSlideProps) {
  const [name, setName] = useState(formData.name || '');
  const [mobile, setMobile] = useState(formData.mobile || '');
  const [email, setEmail] = useState(formData.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast.success('Personal information saved successfully!');
      onComplete({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
      });
    }
  };

  return (
    <div className="p-8 h-full flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <p className="text-muted-foreground">
            Let's start by collecting some basic information about you
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className={errors.mobile ? 'border-red-500' : ''}
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                size="lg"
              >
                Next: Location Detection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}