import React, { useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterState, Product } from '@/types/auction';
import dayjs from 'dayjs';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  filterOptions: {
    categories: string[];
    locations: string[];
    conditions: string[];
  };
  products: Product[];
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  forceRefresh?: () => void;
}

// Format text to have the first letter of each word capitalized
const formatText = (text: string): string => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  filterOptions,
  products,
  onFiltersChange,
  onClearFilters,
  forceRefresh
}) => {
  // Memoize the filter options to prevent recreation
  const uniqueCategories = useMemo(() => filterOptions.categories || [], [filterOptions.categories]);
  const uniqueConditions = useMemo(() => filterOptions.conditions || [], [filterOptions.conditions]);
  const uniqueLocations = useMemo(() => filterOptions.locations || [], [filterOptions.locations]);

  // Generate time left options
  const timeLeftOptions = useMemo(() => [
    { value: '1h', label: 'Less than 1 hour' },
    { value: '12h', label: 'Less than 12 hours' },
    { value: '24h', label: 'Less than 24 hours' },
    { value: '1d+', label: 'More than 1 day' }
  ], []);

  // Calculate price range
  const priceRange = useMemo(() => {
    const defaultMin = 0;
    const defaultMax = 50000;
    return [defaultMin, defaultMax];
  }, []);

  // Memoize the checkbox change handler
  const handleCheckboxChange = useMemo(() => (
    field: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = Array.isArray(filters[field]) 
      ? [...(filters[field] as string[])] 
      : [];
      
    let newValues: string[];
    
    if (checked) {
      if (!currentValues.includes(value)) {
        newValues = [...currentValues, value];
      } else {
        newValues = [...currentValues];
      }
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFiltersChange({
      ...filters,
      [field]: newValues,
    });
  }, [filters, onFiltersChange]);

  // Memoize the price range change handler
  const handlePriceRangeChange = useMemo(() => (value: number[]) => {
    if (value.length === 2 && value[0] <= value[1]) {
      onFiltersChange({
        ...filters,
        priceRange: [value[0], value[1]],
      });
    }
  }, [filters, onFiltersChange]);

  // Memoize the search change handler
  const handleSearchChange = useMemo(() => (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value,
    });
  }, [filters, onFiltersChange]);

  // Memoize the active filters count
  const getActiveFiltersCount = useMemo(() => {
    return (
      (Array.isArray(filters.categories) ? filters.categories.length : 0) +
      (Array.isArray(filters.locations) ? filters.locations.length : 0) +
      (Array.isArray(filters.timeLeft) ? filters.timeLeft.length : 0) +
      (Array.isArray(filters.condition) ? filters.condition.length : 0) +
      (filters.searchQuery ? 1 : 0) +
      (filters.priceRange && 
       (filters.priceRange[0] > 0 || 
        filters.priceRange[1] < 50000) ? 1 : 0)
    );
  }, [filters]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            // Remove animation for desktop by setting transition to 0
            transition={{ 
              x: { type: 'tween', duration: 0 }, 
              opacity: { duration: 0 }
            }}
            className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 lg:relative lg:w-full lg:h-auto lg:bg-transparent lg:border-0"
          >
            <Card className="h-full lg:h-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border lg:border-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Filters</h2>
                  {getActiveFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFiltersCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearFilters();
                      if (forceRefresh) {
                        setTimeout(forceRefresh, 100);
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 px-4 pb-4">
                <div className="space-y-6 py-4">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Price Range: ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
                    </Label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={50000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Categories</Label>
                    <div className="space-y-2">
                      {uniqueCategories.length > 0 ? (
                        uniqueCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={filters.categories.includes(category)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('categories', category, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No categories available</p>
                      )}
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Time Left</Label>
                    <div className="space-y-2">
                      {timeLeftOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={filters.timeLeft.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange('timeLeft', option.value, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={option.value}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Locations</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uniqueLocations.length > 0 ? (
                        uniqueLocations.map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={filters.locations.includes(location)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('locations', location, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`location-${location}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {location}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No locations available</p>
                      )}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Condition</Label>
                    <div className="space-y-2">
                      {uniqueConditions.length > 0 ? (
                        uniqueConditions.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={filters.condition.includes(condition)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('condition', condition, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`condition-${condition}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {condition}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No conditions available</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Memoize the FilterPanel to prevent unnecessary re-renders
export default memo(FilterPanel);