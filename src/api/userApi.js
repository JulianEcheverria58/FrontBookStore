import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const rechargeBalance = async (amount) => {
  try {
    const response = await axios.post(`${API_URL}/recharge`, { amount }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error recharging balance:', error);
    throw error;
  }
};