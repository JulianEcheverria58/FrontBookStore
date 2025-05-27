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
    // Validación de campos requeridos
    if (!paymentData?.userEmail || !paymentData?.totalAmount || !paymentData?.cartItems) {
      throw new Error('Faltan datos requeridos para el pago');
    }

    // Payload alineado con el backend
    const payload = {
      userEmail: paymentData.userEmail,
      totalAmount: paymentData.totalAmount,
      cartItems: paymentData.cartItems,
      ipCliente: paymentData.ipCliente || 'unknown',
      paymentMethod: paymentData.paymentMethod || 'membership'
    };

    console.log('Payload final:', payload);

    const response = await axios.post(`${API_URL}/process`, payload, {
      headers: getAuthHeader(),
      timeout: 10000 
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Error en el servidor');
    }

    return {
      success: true,
      newBalance: response.data.newBalance,
      message: response.data.message
    };

  } catch (error) {
    console.error('Payment API Error:', {
      request: error.config?.data,
      response: error.response?.data
    });
    
    let errorMessage = 'Error de conexión. Revise su red e intente nuevamente';
    
    if (error.response) {
      // Manejo específico de errores 400
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Datos de pago inválidos';
      }
      // Manejo de errores 404 (usuario no encontrado)
      else if (error.response.status === 404) {
        errorMessage = 'Usuario no encontrado. Por favor inicie sesión nuevamente';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// FUNCIÓN MODIFICADA (solo aquí hay cambios)
export const getUserBalance = async (email) => {
  try {
    // Validación básica de email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Credenciales inválidas');
    }

    const response = await axios.get(
      `http://localhost:8080/api/users/${encodeURIComponent(email)}/balance`,
      { 
        headers: getAuthHeader(),
        timeout: 8000 // Timeout agregado
      }
    );

    // Validar estructura de respuesta
    if (typeof response.data?.membershipBalance !== 'number') {
      throw new Error('Formato de saldo inválido');
    }

    return response.data.membershipBalance;

  } catch (error) {
    console.error('Balance Error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Mensaje mejorado
    const defaultMessage = error.response?.status === 401 
      ? 'Sesión expirada o no autorizada' 
      : 'Error obteniendo saldo';
    
    throw new Error(error.response?.data?.message || defaultMessage);
  }
};