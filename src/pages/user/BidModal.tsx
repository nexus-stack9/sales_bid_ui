import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { placeBid, getUserIdFromToken } from '@/services/crudService';

// Format price helper function
const formatPrice = (price: number | string): string => {
  let priceNumber: number;
  if (typeof price === 'string') {
    priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) return '₹ 0';
  } else {
    priceNumber = price;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceNumber).replace('₹', '₹ ');
};

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBid: number;
  productId: number;
  onBidSuccess?: () => void; // Optional callback for bid success
}

const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, currentBid, productId, onBidSuccess }) => {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (isNaN(amount)) {
      setError("Please enter a valid number");
      return;
    }

    if (amount <= currentBid) {
      setError(`Bid amount must be higher than ${formatPrice(currentBid)}`);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      await placeBid(productId.toString(), amount);
      toast({
        title: 'Bid Placed!',
        description: `Your bid of ${formatPrice(amount)} has been placed successfully.`,
      });
      setBidAmount("");
      onBidSuccess?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setBidAmount(value);
      setError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Place Your Bid</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-800">
                Minimum bid: {formatPrice(currentBid + 50)}
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                id="bidAmount"
                value={bidAmount}
                onChange={handleInputChange}
                className="focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block w-full pl-8 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg"
                placeholder="0.00"
                min={currentBid + 1}
                step="1"
                required
                pattern="\d*\.?\d*"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Current Bid</span>
              <span className="text-sm font-medium text-gray-900">{formatPrice(currentBid)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Your Bid</span>
              <span className="text-amber-600">
                {bidAmount ? formatPrice(parseFloat(bidAmount)) : '--'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Bid...
                </span>
              ) : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;