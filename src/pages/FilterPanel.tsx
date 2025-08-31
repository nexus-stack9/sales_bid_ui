import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterState, Product } from "@/types/auction";
import dayjs from "dayjs";

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
  maxPrice?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  filterOptions,
  products,
  onFiltersChange,
  onClearFilters,
  forceRefresh,
  maxPrice = 50000,
}) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  // Update tempFilters when parent filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Update tempFilters when maxPrice changes
  useEffect(() => {
    if (maxPrice && maxPrice !== 50000) {
      setTempFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], Math.min(prev.priceRange[1], maxPrice)] as [number, number]
      }));
    }
  }, [maxPrice]);

  // Time left options
  const timeLeftOptions = [
    { value: "1h", label: "Less than 1 hour" },
    { value: "12h", label: "Less than 12 hours" },
    { value: "24h", label: "Less than 24 hours" },
    { value: "1d+", label: "More than 1 day" },
  ];

  // Checkbox change handler
  const handleCheckboxChange = (field: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = Array.isArray(tempFilters[field])
      ? [...(tempFilters[field] as string[])]
      : [];

    let newValues: string[];

    if (checked) {
      if (!currentValues.includes(value)) {
        newValues = [...currentValues, value];
      } else {
        newValues = [...currentValues];
      }
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    setTempFilters({
      ...tempFilters,
      [field]: newValues,
    });
  };

  // Price range change handler
  const handlePriceRangeChange = (value: number[]) => {
    if (value.length === 2 && value[0] <= value[1]) {
      setTempFilters({
        ...tempFilters,
        priceRange: [value[0], value[1]] as [number, number],
      });
    }
  };

  // Search change handler
  const handleSearchChange = (value: string) => {
    setTempFilters({
      ...tempFilters,
      searchQuery: value,
    });
  };

  // Apply filters function
  const applyFilters = () => {
    onFiltersChange(tempFilters);
    // Close the filter panel on mobile after applying
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Clear filters function
  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      locations: [],
      priceRange: [0, maxPrice] as [number, number],
      timeLeft: [],
      condition: [],
      searchQuery: "",
    };
    setTempFilters(clearedFilters);
    onClearFilters();
  };

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    return (
      (Array.isArray(tempFilters.categories) ? tempFilters.categories.length : 0) +
      (Array.isArray(tempFilters.locations) ? tempFilters.locations.length : 0) +
      (Array.isArray(tempFilters.timeLeft) ? tempFilters.timeLeft.length : 0) +
      (Array.isArray(tempFilters.condition) ? tempFilters.condition.length : 0) +
      (tempFilters.searchQuery ? 1 : 0) +
      (tempFilters.priceRange &&
      (tempFilters.priceRange[0] > 0 || tempFilters.priceRange[1] < maxPrice) ? 1 : 0)
    );
  };

  // Check if any filters are different from the applied filters
  const hasUnappliedChanges = () => {
    return (
      JSON.stringify(tempFilters.categories) !== JSON.stringify(filters.categories) ||
      JSON.stringify(tempFilters.locations) !== JSON.stringify(filters.locations) ||
      JSON.stringify(tempFilters.timeLeft) !== JSON.stringify(filters.timeLeft) ||
      JSON.stringify(tempFilters.condition) !== JSON.stringify(filters.condition) ||
      tempFilters.searchQuery !== filters.searchQuery ||
      tempFilters.priceRange[0] !== filters.priceRange[0] ||
      tempFilters.priceRange[1] !== filters.priceRange[1]
    );
  };

  const activeFiltersCount = getActiveFiltersCount();
  const unappliedChanges = hasUnappliedChanges();

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
            transition={{
              x: { type: "tween", duration: 0 },
              opacity: { duration: 0 },
            }}
            className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 lg:relative lg:w-full lg:h-auto lg:bg-transparent lg:border-0 flex flex-col"
          >
            <Card className="h-full lg:h-auto flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border lg:border-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}

                  {/* Apply Filters Button */}
                  {unappliedChanges && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={applyFilters}
                      className="ml-2"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Clear All Button */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  )}
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
                      Price Range: ₹
                      {tempFilters.priceRange[0].toLocaleString("en-IN")} - ₹
                      {tempFilters.priceRange[1].toLocaleString("en-IN")}
                    </Label>
                    <Slider
                      value={tempFilters.priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={maxPrice}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Categories</Label>
                    <div className="space-y-2">
                      {filterOptions.categories.length > 0 ? (
                        filterOptions.categories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category}`}
                              checked={tempFilters.categories.includes(category)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "categories",
                                  category,
                                  checked as boolean
                                )
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
                        <p className="text-sm text-muted-foreground">
                          No categories available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Time Left</Label>
                    <div className="space-y-2">
                      {timeLeftOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option.value}
                            checked={tempFilters.timeLeft.includes(option.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                "timeLeft",
                                option.value,
                                checked as boolean
                              )
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
                      {filterOptions.locations.length > 0 ? (
                        filterOptions.locations.map((location) => (
                          <div
                            key={location}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`location-${location}`}
                              checked={tempFilters.locations.includes(location)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "locations",
                                  location,
                                  checked as boolean
                                )
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
                        <p className="text-sm text-muted-foreground">
                          No locations available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Condition</Label>
                    <div className="space-y-2">
                      {filterOptions.conditions.length > 0 ? (
                        filterOptions.conditions.map((condition) => (
                          <div
                            key={condition}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={tempFilters.condition.includes(condition)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "condition",
                                  condition,
                                  checked as boolean
                                )
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
                        <p className="text-sm text-muted-foreground">
                          No conditions available
                        </p>
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

export default FilterPanel;