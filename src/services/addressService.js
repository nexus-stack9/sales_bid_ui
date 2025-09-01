// src/services/addressService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetch all addresses for a user
 * @param {number} userId
 * @returns {Promise<Array>} list of addresses
 */
export const getUserAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/addres/address/${userId}`);
    return response.data.addresses;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Add a new address for a user
 * @param {Object} addressData
 * @returns {Promise<Object>} created address
 */
export const addUserAddress = async (addressData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addres/addAddress`, addressData);
    return response.data.address;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const deleteUserAddress = async (addressId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/addres/deleteAddress/${addressId}`);
    return response.data.address;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateUserAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/addres/editAddress/${addressId}`, addressData);
    return response.data.address;
  } catch (err) {
    throw err.response?.data || err;
  }
};
