import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

interface ApiResponseData {
  message?: string;
  [key: string]: unknown;
}

interface ApiError extends Error {
  response?: {
    data?: ApiResponseData;
    status?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('authToken');
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('authToken');
};

export const logout = (): void => {
  // Remove all auth-related cookies
  Cookies.remove('authToken');
  Cookies.remove('refreshToken');
  Cookies.remove('userId');
  
  // Clear any additional auth data from localStorage if needed
  localStorage.removeItem('user');
  
  // Redirect to signin page
  window.location.href = '/signin';
};

export const handleApiError = (error: unknown): void => {
  // Type guard to check if error is an object
  const isErrorWithResponse = (
    error: unknown
  ): error is { response?: { data?: { message?: string } } } => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    );
  };

  let errorMessage = 'An error occurred';
  
  if (isErrorWithResponse(error)) {
    errorMessage = error.response?.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  if (errorMessage === 'Invalid or expired token' || errorMessage.includes('token')) {
    // Show toast notification
    toast({
      variant: 'destructive',
      title: 'Session Expired',
      description: 'Your session has expired. Please sign in again.',
    });
    
    // Logout and redirect
    logout();
  } else {
    // For other errors, just show the error message
    toast({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
    });
  }
};