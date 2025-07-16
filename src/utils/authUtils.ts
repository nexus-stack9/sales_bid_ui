import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

/**
 * Checks if the response indicates an invalid token and handles it
 * @param response The fetch Response object
 * @returns boolean - true if token is invalid, false otherwise
 */
export const handleTokenValidation = (response: Response): boolean => {
  if (response.status === 401) {
    // Token is invalid or expired
    Cookies.remove('authToken');
    window.location.href = '/login';
    return true;
  }
  return false;
};

/**
 * Gets the auth token from cookies
 * @returns string | undefined - The auth token or undefined if not found
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get('authToken');
};

/**
 * Removes the auth token and redirects to login
 */
export const logout = (): void => {
  Cookies.remove('authToken');
  window.location.href = '/login';
};
