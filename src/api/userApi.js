import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getProfile = async (email) => {
  if (!email) {
    throw new Error("Email parameter is required");
  }

  try {
    const response = await axios.get(`${API_URL}/profile/${email}`);
    return response.data;
  } catch (error) {
    console.error("API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const updateProfile = async (email, userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile/${email}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const rechargeBalance = async (email, amount) => {
  try {
    const response = await axios.post(`${API_URL}/recharge/${email}`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error recharging balance:', error);
    throw error;
  }
};