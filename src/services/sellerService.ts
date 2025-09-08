import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const sellerService = {
  // Get all sellers
  getAllSellers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sellers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },

  // Get seller by ID
  getSellerById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sellers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller:', error);
      throw error;
    }
  },

  // Create new seller
  createSeller: async (sellerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sellers/addSeller`, sellerData);
      return response.data;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    }
  },



updateSellerPath: async (data) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/sellers/updatePaath${data.vendor_id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating seller status:', error);
      throw error;
    }
  },
  // Update seller status
  updateSellerStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/sellers/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating seller status:', error);
      throw error;
    }
  },

  // Delete seller
  deleteSeller: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sellers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting seller:', error);
      throw error;
    }
  }
};

export default sellerService;