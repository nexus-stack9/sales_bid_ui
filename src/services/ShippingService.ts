import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ShippingRateRequest {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  length: number;
  breadth: number;
  height: number;
  declared_value?: number;
  cod: number;
}

interface ShippingOption {
  courier_name: string;
  courier_company_id: number;
  rate: number;
  cod_charges: number;
  freight_charge: number;
  estimated_delivery_days: string;
  etd: string;
  base_courier_id: number | null;
  local_region: number;
  metro: number;
  zone: string;
}

export interface ShippingRateResponse {
  success: boolean;
  data?: {
    total_options: number;
    cheapest_option: ShippingOption;
    all_options: ShippingOption[];
  };
  error?: string;
}

export const calculateShippingRates = async (data: ShippingRateRequest): Promise<ShippingRateResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delivery/calculate-shipping-rates`, data, {
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to calculate shipping rates',
    };
  }
};
