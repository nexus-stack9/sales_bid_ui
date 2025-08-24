import React, { useState } from 'react';
import { X, Truck, Store, Package, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Gradient colors matching the buy button
const BUTTON_GRADIENT = 'linear-gradient(135deg, #09146ad4, #2722c7)';
const BUTTON_HOVER_GRADIENT = 'linear-gradient(135deg, #0a1877d4, #2d28d8)';
const PRIMARY_COLOR = '#2722c7'; // Base color from gradient

interface ShippingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  price: string;
  shippingOptions: string[];
}

const getShippingIcon = (option: string) => {
  const lowerOption = option.toLowerCase();
  if (lowerOption.includes('delivery')) return <Truck className="h-5 w-5" style={{ background: BUTTON_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />;
  if (lowerOption.includes('pickup') || lowerOption.includes('store')) return <Store className="h-5 w-5" style={{ background: BUTTON_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />;
  return <Package className="h-5 w-5" style={{ background: BUTTON_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />;
};

const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ShippingOptionsModal: React.FC<ShippingOptionsModalProps> = ({
  isOpen,
  onClose,
  productId,
  price,
  shippingOptions = []
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    if (!selectedOption) return;
    onClose();
    navigate(`/checkout/${productId}?type=buy-now&price=${price}&shipping=${encodeURIComponent(selectedOption)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Select Shipping Method</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4 mb-8">
            {shippingOptions.map((option, index) => {
              const formattedOption = capitalizeWords(option);
              const isSelected = selectedOption === option;
              return (
                <div 
                  key={option} 
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `border-[#2722c7] bg-[#f0f4ff]` 
                      : 'border-gray-200 hover:border-[#a5b4fc] hover:bg-[#f8f9ff]'
                  } ${index < shippingOptions.length - 1 ? 'mb-4' : ''}`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div 
                        className={`flex items-center justify-center h-6 w-6 rounded-full border-2 ${
                          isSelected 
                            ? 'border-[#2722c7]' 
                            : 'border-gray-300'
                        }`}
                        style={{
                          background: isSelected ? BUTTON_GRADIENT : 'white'
                        }}
                      >
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        {getShippingIcon(option)}
                        <span className="ml-2 font-medium text-gray-900">
                          {formattedOption}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {option.toLowerCase().includes('delivery') 
                          ? 'Delivered to your address within 3-5 business days' 
                          : option.toLowerCase().includes('pickup')
                            ? 'Available for pickup at our store location'
                            : 'Standard shipping details'}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div 
                      className="absolute -bottom-2 right-4 text-white text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ 
                        background: BUTTON_GRADIENT,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={!selectedOption}
              className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 ${
                selectedOption 
                  ? 'transform hover:scale-105' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              style={{
                background: selectedOption ? BUTTON_GRADIENT : '',
                ...(selectedOption && {
                  ':hover': {
                    background: BUTTON_HOVER_GRADIENT
                  }
                })
              }}
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptionsModal;
