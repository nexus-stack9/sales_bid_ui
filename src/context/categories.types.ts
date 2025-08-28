import { ReactNode } from 'react';

export type CategoriesContextType = {
  categories: string[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
};

export type CategoriesProviderProps = {
  children: ReactNode;
};
