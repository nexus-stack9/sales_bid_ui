import Cookies from 'js-cookie';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


/**
 * Decodes a JWT token and extracts the payload
 * @param token The JWT token to decode
 * @returns The decoded payload as an object
 */
const decodeJwtToken = (token: string) => {
  try {
    // JWT tokens are split into three parts: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Gets the user ID from the JWT token stored in cookies
 * @returns The user ID from the token, or null if not found
 */
export const getUserIdFromToken = (): string | null => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      return null;
    }

    const decodedToken = decodeJwtToken(token);
    // Assuming the user ID is stored in the 'sub' or 'userId' field
    // Adjust this based on your actual token structure
    return decodedToken?.sub || decodedToken?.userId || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

/**
 * Updates the user profile with the provided data
 * @param profileData The profile data to update
 * @returns The response data from the API
 */
export const updateProfile = async (profileData: ProfileData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the user's password
 * @param passwordData Object containing current and new password
 * @returns The response data from the API
 */
export const updatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the user profile details by ID
 * @param userId The ID of the user to fetch details for
 * @returns The response data from the API containing user profile details
 */
export const getProfileDetails = async (userId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/details/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }



};