import React, { useState } from "react";
import {
  X,
  Truck,
  Store,
  Package,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateShippingRates } from "@/services/ShippingService";

// Gradient colors
const BUTTON_GRADIENT = "linear-gradient(135deg, #09146ad4, #2722c7)";
const PRIMARY_COLOR = "#2722c7";

interface ShippingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  price: string;
  shippingOptions: string[];
  productDetails?: {
    weight?: number;
    length?: number;
    breadth?: number;
    height?: number;
    seller_pincode?: string;
  };
}

interface ShippingRate {
  rate: number;
  estimated_delivery_days: string;
  etd: string;
  courier_name?: string;
}

const getShippingIcon = (option: string) => {
  const lowerOption = option.toLowerCase();
  if (lowerOption.includes("delivery"))
    return (
      <Truck
        className="h-5 w-5"
        style={{
          background: BUTTON_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      />
    );
  if (lowerOption.includes("pickup") || lowerOption.includes("store"))
    return (
      <Store
        className="h-5 w-5"
        style={{
          background: BUTTON_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      />
    );
  return (
    <Package
      className="h-5 w-5"
      style={{
        background: BUTTON_GRADIENT,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    />
  );
};

const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ShippingOptionsModal: React.FC<ShippingOptionsModalProps> = ({
  isOpen,
  onClose,
  productId,
  price,
  shippingOptions = [],
  productDetails = {},
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate | null>(null);
  const [error, setError] = useState<string>("");
  const [showPincodeInput, setShowPincodeInput] = useState<boolean>(true);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOptionSelect = (option: string) => {
    if (option !== selectedOption) {
      setSelectedOption(option);
      setShippingRates(null);
      setError("");
      setPincode(""); // Only reset pincode if a different option is selected
      setShowPincodeInput(true);
    }
  };

  const handlePincodeSubmit = async () => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsCalculating(true);
    setError("");
    console.log("Submitting pincode:", pincode); // Debug log

    try {
      const shippingData = {
        pickup_postcode: productDetails.seller_pincode || "",
        delivery_postcode: pincode,
        weight: parseFloat(productDetails.weight?.toString() || "0"),
        length: parseFloat(productDetails.length?.toString() || "0"),
        breadth: parseFloat(productDetails.breadth?.toString() || "0"),
        height: parseFloat(productDetails.height?.toString() || "0"),
        cod: 0,
      };

      const response = await calculateShippingRates(shippingData);

      if (response.success && response.data) {
        setShippingRates(response.data.cheapest_option);
        setShowPincodeInput(false); // Show summary view
        console.log("Pincode after API success:", pincode); // Debug log
      } else {
        setError(response.error || "Unable to fetch shipping rate");
      }
    } catch (err) {
      console.error("Error calculating shipping rates:", err);
      setError("Failed to calculate shipping. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleChangePincode = () => {
    setShowPincodeInput(true);
    setShippingRates(null);
    setError("");
    setPincode(""); // Clear pincode when switching back to input mode
  };

  const handleProceedToCheckout = () => {
    if (!selectedOption) return;

    let checkoutUrl = `/checkout/${productId}?type=buy-now&price=${price}&shipping=${encodeURIComponent(
      selectedOption
    )}`;

    if (shippingRates) {
      checkoutUrl += `&shippingRate=${
        shippingRates.rate
      }&deliveryDate=${encodeURIComponent(shippingRates.etd)}`;
    }

    onClose();
    navigate(checkoutUrl);
  };

  const isDeliveryOption = (option: string) => {
    return option.toLowerCase().includes("delivery");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Select Shipping Method
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {shippingOptions.map((option) => {
              const formattedOption = capitalizeWords(option);
              const isSelected = selectedOption === option;
              const isDelivery = isDeliveryOption(option);

              return (
                <div
                  key={option}
                  className={`relative border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[#2722c7] bg-[#f0f4ff]"
                      : "border-gray-200 hover:border-[#a5b4fc] hover:bg-[#f8f9ff]"
                  }`}
                >
                  <div
                    className="p-3"
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`flex items-center justify-center h-6 w-6 rounded-full border-2 ${
                            isSelected ? "border-[#2722c7]" : "border-gray-300"
                          }`}
                          style={{
                            background: isSelected ? BUTTON_GRADIENT : "white",
                          }}
                        >
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          {getShippingIcon(option)}
                          <span className="font-medium text-gray-900">
                            {formattedOption}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {isDelivery
                            ? "Check delivery availability and charges"
                            : option.toLowerCase().includes("pickup")
                            ? "Collect from our store location"
                            : "Standard shipping applied"}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="absolute -bottom-2 right-3 text-white text-xs font-medium px-2 py-0.5 rounded-full text-nowrap"
                        style={{ background: BUTTON_GRADIENT }}
                      >
                        Selected
                      </div>
                    )}

                    {/* Delivery Section */}
                    {isSelected && isDelivery && (
                      <div className="px-3 pb-3 border-t border-gray-100 pt-3">
                        {/* Pincode Input Mode */}
                        {showPincodeInput ? (
                          <>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
                              Delivery Pincode
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={pincode}
                                onChange={(e) =>
                                  setPincode(
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 6)
                                  )
                                }
                                placeholder="Enter 6-digit pincode"
                                className="flex-1 text-sm px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2722c7] focus:border-[#2722c7]"
                                maxLength={6}
                                aria-label="6-digit delivery pincode"
                              />
                              <button
                                onClick={handlePincodeSubmit}
                                disabled={isCalculating || pincode.length !== 6}
                                className={`w-16 text-sm font-medium text-white rounded-lg transition-all flex items-center justify-center ${
                                  isCalculating || pincode.length !== 6
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "transform hover:scale-105"
                                }`}
                                style={{
                                  background:
                                    isCalculating || pincode.length !== 6
                                      ? undefined
                                      : BUTTON_GRADIENT,
                                }}
                              >
                                {isCalculating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Go"
                                )}
                              </button>
                            </div>
                            {error && (
                              <p className="mt-1.5 text-xs text-red-500">
                                {error}
                              </p>
                            )}
                          </>
                        ) : (
                          /* Summary View */
                          <div className="space-y-2">
                            <div className="flex items-center justify-between min-w-0 overflow-visible">
                              <div className="flex-shrink-0">
                                <p className="text-sm font-semibold text-gray-800">
                                  Deliver to{" "}
                                  <span
                                    className="text-sm font-bold text-[#2722c7] inline bg-gray-100 px-1.5 py-0.5 rounded"
                                    style={{ display: "inline" }}
                                  >
                                    {pincode}
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={handleChangePincode}
                                className="flex items-center gap-1 text-xs font-medium text-[#2722c7] hover:text-[#1a1490] transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                                Change
                              </button>
                            </div>

                            {/* Highlighted Delivery Details */}
                            <div
                              className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm"
                              style={{
                                background:
                                  "linear-gradient(90deg, #f0f7ff, #edf3ff)",
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p
                                    className="text-sm font-bold text-gray-800"
                                    style={{
                                      background: BUTTON_GRADIENT,
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    }}
                                  >
                                    ₹{shippingRates?.rate.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    Delivery charge
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className="text-sm font-semibold text-gray-800"
                                    style={{
                                      background: BUTTON_GRADIENT,
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    }}
                                  >
                                    {shippingRates?.etd}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    Estimated delivery
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={
                !selectedOption ||
                (isDeliveryOption(selectedOption) && !shippingRates)
              }
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 ${
                selectedOption &&
                (!isDeliveryOption(selectedOption) || shippingRates)
                  ? "transform hover:scale-105"
                  : "opacity-60 cursor-not-allowed"
              }`}
              style={{
                background:
                  selectedOption &&
                  (!isDeliveryOption(selectedOption) || shippingRates)
                    ? BUTTON_GRADIENT
                    : "",
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
