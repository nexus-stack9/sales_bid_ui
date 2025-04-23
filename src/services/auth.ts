/* eslint-disable no-useless-catch */
import CryptoJS from 'crypto-js';

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

    const response = await fetch('http://localhost:3000/auth/register', {
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

    const response = await fetch('http://localhost:3000/auth/login', {
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