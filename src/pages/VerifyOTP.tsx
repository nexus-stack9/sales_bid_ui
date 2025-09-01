import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { verifyOTP, forgotPassword, resetPassword } from "@/services/auth";
import logo from "@/assets/logo.png";

// Helper function to parse time string like "10 minutes" to seconds
const parseTimeToSeconds = (timeString: string): number => {
  const [value, unit] = timeString.split(' ');
  const numValue = parseInt(value, 10);
  
  if (unit.includes('minute')) return numValue * 60;
  if (unit.includes('second')) return numValue;
  if (unit.includes('hour')) return numValue * 3600;
  
  return 300; // Default to 5 minutes if format is unexpected
};

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email/phone from location state
  const contact = location.state?.contact || '';
  const expiresIn = location.state?.expiresIn || '10 minutes';
  
  // Set initial time left based on expiresIn
  useEffect(() => {
    if (location.state?.expiresIn) {
      setTimeLeft(parseTimeToSeconds(location.state.expiresIn));
    } else {
      setTimeLeft(600); // Default to 10 minutes if not provided
    }
  }, [location.state?.expiresIn]);
  
  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleResendOTP = async () => {
    if (timeLeft > 0) return; // Prevent resend if timer is still running
    
    setIsResending(true);
    
    try {
      await forgotPassword({ contact });
      
      // Reset the timer to 10 minutes
      setTimeLeft(600);
      
      toast({
        title: "OTP Resent",
        description: `A new OTP has been sent to ${contact}. It will expire in 10 minutes.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    digits.forEach((digit, i) => {
      if (index + i < 6) {
        newOtp[index + i] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the last input field with a value
    const lastFilledIndex = Math.min(index + digits.length - 1, 5);
    const nextInput = document.getElementById(`otp-${lastFilledIndex}`) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    // Validation
    if (otpCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    if (!password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a new password",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call reset password with OTP and new password
      await resetPassword({ 
        credentials: contact,
        newPassword: password,
        otp: otpCode
      });
      
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated successfully. You can now log in with your new password.",
      });
      
      // Navigate to login after successful password reset
      navigate('/signin');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {contact}
          </CardDescription>
          <div className="flex flex-col items-center space-y-2">
            {timeLeft > 0 ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Code expires in: <span className="font-medium text-red-500">{formatTime(timeLeft)}</span></p>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="h-8 px-4 text-sm"
                onClick={handleResendOTP}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Resend OTP
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
            

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={8}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit code</Label>
                <div className="flex justify-center space-x-2">
                  {otp.map((data, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      value={data}
                      onChange={e => handleOtpChange(e.target as HTMLInputElement, index)}
                      onPaste={e => handlePaste(e, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      className="w-12 h-14 text-center text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || otp.some(digit => !digit)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to previous
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
