import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';



const OrderService = {
  /**
   * Place a new order
   * @param {Object} orderData
   * @param {number} orderData.product_id
   * @param {number} orderData.buyer_id
   * @param {number} orderData.seller_id
   * @param {number} [orderData.winning_bid_id]
   */
  placeOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data; // { success: true, order: {...} }
    } catch (err) {
      console.error("Failed to place order", err);
      throw err.response?.data || err;
    }
  },
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/users/${userId}/orders`);
    return response.data.orders;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export default OrderService;