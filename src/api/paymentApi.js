import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payments';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const processPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/process`, paymentData, {
      headers: getAuthHeader()
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al procesar el pago');
    }
    
    return {
      success: true,
      message: response.data.message,
      newBalance: response.data.newBalance
    };
    
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error al procesar el pago. Por favor intente nuevamente.'
    );
  }
};

export const getUserBalance = async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email);  
    const response = await axios.get(`http://localhost:8080/api/users/${encodedEmail}/balance`);
    return response.data.membershipBalance;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
};