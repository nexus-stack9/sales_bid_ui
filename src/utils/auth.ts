import Cookies from 'js-cookie';

export const isAuthenticated = (): boolean => {
  const token = Cookies.get('authToken');
  return !!token;
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('authToken');
};

export const logout = (): void => {
  Cookies.remove('authToken');
  // You can add additional logout logic here if needed
};