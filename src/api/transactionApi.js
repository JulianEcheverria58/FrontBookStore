import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payments';

const fetchClientIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'unknown';
  }
};

const transactionApi = {
  createTransaction: async (transactionData) => {
    try {
      const ip = await fetchClientIP();
      
      const payload = {
        userEmail: transactionData.userEmail,
        totalAmount: transactionData.totalAmount,
        cartItems: transactionData.bookIds.map(id => ({
          bookId: id,
          quantity: 1, // O la cantidad adecuada
          price: transactionData.totalAmount / transactionData.bookIds.length
        })),
        ipCliente: ip,
        paymentMethod: "membership"
      };

      console.log('Enviando transacción:', payload);

      const response = await axios.post(`${API_URL}/process`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return response.data;
    } catch (error) {
      const errorDetails = error.response?.data || { message: error.message };
      console.error('Error detallado:', errorDetails);
      throw new Error(errorDetails.message || 'Error creating transaction');
    }
  },

  getTransactionsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const errorDetails = error.response?.data || { message: error.message };
      throw new Error(errorDetails.message || 'Error fetching transactions');
    }
  }
};

export default transactionApi;