import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/services/auth";
import {
  Eye,
  EyeOff,
  Gavel,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Clock,
  Award,
} from "lucide-react";
import logoNoBg from "@/assets/logo.png";
import CryptoJS from "crypto-js";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const secretKey = import.meta.env.VITE_SECRET_KEY; // for Vite
  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    };
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s()-]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
    
        await registerUser(formData);
        navigate("/signin");
      } catch (error) {
        toast({
          title: "Registration failed",
          description:
            "An error occurred during registration. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Auction themed creative section - NARROWER */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-8 flex-col justify-center relative overflow-hidden">
        <div className="flex justify-start mb-6">
          <img src={logoNoBg} alt="Logo" className="h-16 w-auto" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Gavel className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold">Premium Auctions</h1>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Join Our Exclusive Shopping Community
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Create your account today and start discovering unique treasures.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
              <ShoppingBag className="h-6 w-6 mr-3 text-purple-300 flex-shrink-0" />
              <p>Access rare and unique items not available elsewhere</p>
            </div>

            <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
              <Clock className="h-6 w-6 mr-3 text-purple-300 flex-shrink-0" />
              <p>Experience the thrill of real-time auctions</p>
            </div>

            <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
              <Award className="h-6 w-6 mr-3 text-purple-300 flex-shrink-0" />
              <p>All items authenticated by our expert team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form - NO CARD, BIGGER FIELDS */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center p-8 bg-gray-50">
        {/* Logo with display conditional on screen size */}
        <div className="w-full max-w-lg">
          {/* Mobile logo (centered) - only visible on mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <img src={logoNoBg} alt="Logo" className="h-16 w-auto" />
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-gray-600">
              Join thousands of collectors and start shopping today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`h-12 text-lg ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`h-12 text-lg ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                className={`h-12 text-lg ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`h-12 text-lg ${
                  errors.phone ? "border-red-500" : ""
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 text-lg pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="At least 8 characters"
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
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with one uppercase letter
                and one number
              </p>
            </div>

            <div className="flex items-center mt-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex justify-between items-center mt-6 space-x-4">
              <Link
                to="/signin"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Already have an account? Sign in
              </Link>
              <Button
                type="submit"
                className="px-8 py-6 h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 border border-gray-300 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 border border-gray-300 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.528 2.341 1.087 2.91.832.092-.647.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 5.8c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C17.138 18.163 20 14.419 20 10c0-5.523-4.477-10-10-10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 border border-gray-300 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
