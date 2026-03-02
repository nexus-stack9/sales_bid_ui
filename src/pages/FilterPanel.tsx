import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterState, Product } from "@/types/auction";

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    categories: true,
    timeLeft: false,
    locations: false,
    condition: true,
  });

  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

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
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            <Card className="h-full lg:h-auto flex flex-col overflow-hidden rounded-none lg:rounded-2xl border border-gray-100 shadow-sm">

              {/* Header — gradient bar, rounded-t-2xl to fill corners */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-gray-700 leading-none">tune</span>
                  <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 bg-gray-900 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unappliedChanges && (
                    <button
                      onClick={applyFilters}
                      className="hidden lg:block text-[11px] font-black text-white bg-gray-900 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      Apply
                    </button>
                  )}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-2.5 py-1 rounded-full transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px] leading-none">filter_list_off</span>
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="lg:hidden text-gray-500 hover:text-gray-900 p-1 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-3 py-3 space-y-3">

                  {/* Price Range */}
                  <div>
                    <button
                      onClick={() => toggleSection('price')}
                      className="flex items-center justify-between w-full py-1 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#FF6B3D] leading-none">payments</span>
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Price Range</span>
                      </div>
                      <span className={`material-symbols-outlined text-[16px] text-gray-400 leading-none transition-transform duration-200 ${openSections.price ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSections.price && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-black text-gray-900">
                                ₹{tempFilters.priceRange[0].toLocaleString("en-IN")}
                              </span>
                              <span className="text-[11px] font-black text-gray-900">
                                ₹{tempFilters.priceRange[1].toLocaleString("en-IN")}
                              </span>
                            </div>
                            <Slider
                              value={tempFilters.priceRange}
                              onValueChange={handlePriceRangeChange}
                              max={maxPrice}
                              min={0}
                              step={100}
                              className="w-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Categories */}
                  <div>
                    <button
                      onClick={() => toggleSection('categories')}
                      className="flex items-center justify-between w-full py-1 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#FF6B3D] leading-none">category</span>
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Categories</span>
                        {tempFilters.categories.length > 0 && (
                          <span className="text-[9px] font-black text-[#FF6B3D]">({tempFilters.categories.length})</span>
                        )}
                      </div>
                      <span className={`material-symbols-outlined text-[16px] text-gray-400 leading-none transition-transform duration-200 ${openSections.categories ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSections.categories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1 space-y-0.5">
                            {filterOptions.categories.length > 0 ? (
                              filterOptions.categories.map((category) => {
                                const checked = tempFilters.categories.includes(category);
                                return (
                                  <div
                                    key={category}
                                    onClick={() => handleCheckboxChange("categories", category, !checked)}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all select-none ${
                                      checked ? 'bg-orange-50 text-[#FF6B3D]' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all"
                                      style={checked ? { background: 'linear-gradient(to right, #FF6B3D, #FFB444)', borderColor: 'transparent' } : { borderColor: '#d1d5db', background: 'white' }}
                                    >
                                      {checked && (
                                        <span className="material-symbols-outlined text-[10px] text-white leading-none" style={{ fontVariationSettings: `'FILL' 1` }}>check</span>
                                      )}
                                    </span>
                                    <span className="text-[11px] font-semibold">{category}</span>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-[11px] text-gray-400 px-1">No categories available</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Time Left */}
                  <div>
                    <button
                      onClick={() => toggleSection('timeLeft')}
                      className="flex items-center justify-between w-full py-1 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#FF6B3D] leading-none">timer</span>
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Time Left</span>
                        {tempFilters.timeLeft.length > 0 && (
                          <span className="text-[9px] font-black text-[#FF6B3D]">({tempFilters.timeLeft.length})</span>
                        )}
                      </div>
                      <span className={`material-symbols-outlined text-[16px] text-gray-400 leading-none transition-transform duration-200 ${openSections.timeLeft ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSections.timeLeft && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {timeLeftOptions.map((option) => {
                              const checked = tempFilters.timeLeft.includes(option.value);
                              return (
                                <button
                                  key={option.value}
                                  onClick={() => handleCheckboxChange("timeLeft", option.value, !checked)}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                    checked ? 'text-white border-transparent shadow-sm' : 'border-gray-200 text-gray-600 hover:border-[#FF6B3D] hover:text-[#FF6B3D] bg-white'
                                  }`}
                                  style={checked ? { background: 'linear-gradient(to right, #FF6B3D, #FFB444)' } : {}}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Locations */}
                  <div>
                    <button
                      onClick={() => toggleSection('locations')}
                      className="flex items-center justify-between w-full py-1 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#FF6B3D] leading-none">location_on</span>
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Locations</span>
                        {tempFilters.locations.length > 0 && (
                          <span className="text-[9px] font-black text-[#FF6B3D]">({tempFilters.locations.length})</span>
                        )}
                      </div>
                      <span className={`material-symbols-outlined text-[16px] text-gray-400 leading-none transition-transform duration-200 ${openSections.locations ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSections.locations && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1 space-y-0.5 max-h-44 overflow-y-auto">
                            {filterOptions.locations.length > 0 ? (
                              filterOptions.locations.map((location) => {
                                const checked = tempFilters.locations.includes(location);
                                return (
                                  <div
                                    key={location}
                                    onClick={() => handleCheckboxChange("locations", location, !checked)}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all select-none ${
                                      checked ? 'bg-orange-50 text-[#FF6B3D]' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all"
                                      style={checked ? { background: 'linear-gradient(to right, #FF6B3D, #FFB444)', borderColor: 'transparent' } : { borderColor: '#d1d5db', background: 'white' }}
                                    >
                                      {checked && (
                                        <span className="material-symbols-outlined text-[10px] text-white leading-none" style={{ fontVariationSettings: `'FILL' 1` }}>check</span>
                                      )}
                                    </span>
                                    <span className="text-[11px] font-semibold">{location}</span>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-[11px] text-gray-400 px-1">No locations available</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Condition */}
                  <div>
                    <button
                      onClick={() => toggleSection('condition')}
                      className="flex items-center justify-between w-full py-1 group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-[#FF6B3D] leading-none">verified</span>
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Condition</span>
                        {tempFilters.condition.length > 0 && (
                          <span className="text-[9px] font-black text-[#FF6B3D]">({tempFilters.condition.length})</span>
                        )}
                      </div>
                      <span className={`material-symbols-outlined text-[16px] text-gray-400 leading-none transition-transform duration-200 ${openSections.condition ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSections.condition && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {filterOptions.conditions.length > 0 ? (
                              filterOptions.conditions.map((condition) => {
                                const checked = tempFilters.condition.includes(condition);
                                return (
                                  <button
                                    key={condition}
                                    onClick={() => handleCheckboxChange("condition", condition, !checked)}
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                      checked ? 'text-white border-transparent shadow-sm' : 'border-gray-200 text-gray-600 hover:border-[#FF6B3D] hover:text-[#FF6B3D] bg-white'
                                    }`}
                                    style={checked ? { background: 'linear-gradient(to right, #FF6B3D, #FFB444)' } : {}}
                                  >
                                    {condition}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="text-[11px] text-gray-400 px-1">No conditions available</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>



                </div>
              </ScrollArea>

              {/* Footer Apply button — always visible */}
              {unappliedChanges && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={applyFilters}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B3D] to-[#FFB444] text-white text-[12px] font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Apply Filters
                  </button>
                </div>
              )}

            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
