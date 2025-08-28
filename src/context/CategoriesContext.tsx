import React, { createContext, useState, useEffect } from 'react';
import { getProducts } from '@/services/productService';
import { CategoriesContextType, CategoriesProviderProps } from './categories.types';

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getProducts(1, 1); // Minimal data fetch just to get filter options
      if (response.success && response.filterOptions?.categories) {
        setCategories(response.filterOptions.categories);
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider 
      value={{ 
        categories, 
        loading, 
        error, 
        refreshCategories: fetchCategories 
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContext;
