/* eslint-disable no-useless-catch */
import CryptoJS from 'crypto-js';
import Cookies from "js-cookie"; 
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  contact: string; // Can be either email or phone number
}

interface VerifyOTPData {
  contact: string;
  otp: string;
}

interface ResetPasswordData {
  credentials: string;
  otp: string;
  newPassword: string;
}

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const encryptPassword = (password: string) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export const registerUser = async (userData: RegisterUserData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const encryptedUserData = {
      ...userData,
      password: encryptPassword(userData.password)
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encryptedUserData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData: LoginUserData) => {
  try {
    const encryptedUserData = {
      email: userData.email,
      password: encryptPassword(userData.password)
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encryptedUserData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (data: VerifyOTPData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify OTP');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password/request-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to process forgot password request');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordData) => {
  try {
    const requestData = {
      credentials: data.credentials,
      otp: data.otp,
      newPassword: encryptPassword(data.newPassword)
    };

    const response = await fetch(`${API_BASE_URL}/password/verify-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the Content-Type header is set
      },
      body: JSON.stringify({ token }), // Send the Google token in the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    
    // Set tokens in cookies if they exist in the response
    if (data.accessToken) {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
    }
    if (data.refreshToken) {
      Cookies.set('refreshToken', data.refreshToken, { expires: 14 });
    }
    
    return data;

  } catch (error) {
    console.error("Error during Google Login:", error);
    throw error;
  }
}   
