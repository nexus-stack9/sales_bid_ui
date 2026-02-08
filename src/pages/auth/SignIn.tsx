import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertCircle, Gavel, CheckCircle } from 'lucide-react';
import { loginUser, loginWithGoogle } from '@/services/auth';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import logo from '@/assets/logo.png';

// Google OAuth client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginUser(formData);
      
      if (response && response.token) {
        Cookies.set('authToken', response.token, { expires: 7 });
        toast('Sign in successful!');
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      setIsLoading(true);
      const response = await loginWithGoogle(credentialResponse.credential || '');
      
      if (response && response.success && response.accessToken && response.refreshToken) {
        // Set access token (expires in 7 days)
        Cookies.set('authToken', response.accessToken, { 
          expires: 7,
          secure: true,
          sameSite: 'strict'
        });
        
        // Set refresh token (expires in 30 days)
        Cookies.set('refreshToken', response.refreshToken, {
          expires: 30,
          secure: true,
          sameSite: 'strict'
        });
        
        toast.success('Signed in with Google successfully!');
        navigate('/');
      } else {
        throw new Error(response?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign In failed');
    toast.error('Google Sign In was unsuccessful');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auction themed background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Gavel className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold">Premium Listings</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Discover Extraordinary Inventory
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses sourcing curated wholesale inventory with confidence.
          </p>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p>Access to premium and rare collectibles</p>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p>Real-time bidding with live notifications</p>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p>Secure transactions and verified sellers</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10"></div>
      </div>
      {/* Right side - Sign in form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo - only visible on mobile */}
        <div className="lg:hidden flex justify-center w-full mb-8">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder='example@email.com'
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder='Enter your password'
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary hover:opacity-80"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>

            </div>
            <div className="mt-6">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  auto_select
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
