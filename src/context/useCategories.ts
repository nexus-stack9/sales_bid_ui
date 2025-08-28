import { useContext } from 'react';
import CategoriesContext from './CategoriesContext';
import { CategoriesContextType } from './categories.types';

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export default useCategories;
