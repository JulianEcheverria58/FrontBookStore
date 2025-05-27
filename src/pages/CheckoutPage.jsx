import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { processPayment, getUserBalance } from '../api/paymentApi';
import transactionApi from '../api/transactionApi';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { 
    cartItems = [], 
    clearCart, 
    cartTotal = 0 
  } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [transactionId, setTransactionId] = useState('');

  const fetchClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error('Error obteniendo IP:', error);
      return 'unknown';
    }
  };

  useEffect(() => {
    const validateCart = () => {
      if (!user) {
        navigate('/login', { state: { from: '/checkout' } });
        return false;
      }

      if (!cartItems?.length) {
        setErrorMessage('¡Tu carrito está vacío!');
        return false;
      }

      const isValid = cartItems.every(item => 
        item?.id && 
        item?.title &&
        Number.isInteger(item?.quantity) &&
        item.quantity > 0 &&
        typeof item.price === 'number' &&
        item.price > 0
      );

      if (!isValid) {
        setErrorMessage('Algunos items son inválidos');
        return false;
      }

      return true;
    };

    if (!validateCart()) return;

    const loadBalance = async () => {
      try {
        const balance = await getUserBalance(user.email);
        setUserBalance(balance || 0);
      } catch (error) {
        console.error('Error cargando saldo:', error);
        setErrorMessage('Error cargando saldo. Recarga la página.');
        setUserBalance(0);
      }
    };

    loadBalance();
  }, [user, cartItems, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Validaciones iniciales
      if (!user?.email) {
        throw new Error('Usuario no autenticado');
      }

      if (userBalance < cartTotal) {
        throw new Error(`Saldo insuficiente: $${cartTotal.toFixed(2)} requeridos (Tienes: $${userBalance.toFixed(2)})`);
      }

      const clientIp = await fetchClientIP();

      // 1. Procesar el pago principal
      const paymentPayload = {
        userEmail: user.email,
        paymentMethod: "membership",
        totalAmount: cartTotal,
        cartItems: cartItems.map(item => ({
          bookId: String(item.id),
          quantity: item.quantity,
          price: item.price,
          title: item.title
        })),
        ipCliente: clientIp
      };

      console.log('Enviando pago:', paymentPayload);
      const paymentResult = await processPayment(paymentPayload);
      
      if (!paymentResult?.success) {
        throw new Error(paymentResult?.message || 'Error en el procesamiento del pago');
      }

      // 2. Registrar la transacción (opcional - solo si es necesario)
      try {
        const transactionResult = await transactionApi.createTransaction({
          userEmail: user.email,
          totalAmount: cartTotal,
          bookIds: cartItems.map(item => item.id),
          clientIp: clientIp
        });
        setTransactionId(transactionResult.id || paymentResult.transactionId);
      } catch (transactionError) {
        console.warn('Advertencia al registrar transacción:', transactionError);
        // No fallar todo el proceso si solo falla el registro secundario
        setTransactionId(paymentResult.transactionId || 'no-registrada');
      }

      // Éxito del proceso
      setIsSuccess(true);
      clearCart();
      setUserBalance(paymentResult.newBalance);

      // Redirigir después de 2 segundos
      setTimeout(() => navigate('/profile/orders'), 2000);

    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setErrorMessage(
        error.message.includes('Usuario no encontrado')
          ? 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente: Loader
  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-3 text-gray-600">Procesando transacción...</p>
    </div>
  );

  // Componente: Éxito
  const renderSuccess = () => (
    <div className="p-6 text-center bg-green-50 rounded-lg">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <h2 className="mt-4 text-xl font-semibold">¡Compra Exitosa!</h2>
      {transactionId && (
        <p className="mt-2 text-sm text-gray-600">
          ID de Transacción: <span className="font-mono">{transactionId}</span>
        </p>
      )}
      <p className="mt-2 text-gray-600">
        Nuevo saldo: <span className="font-semibold">${userBalance.toFixed(2)}</span>
      </p>
      <p className="mt-4 text-gray-600">Redirigiendo a tu historial...</p>
    </div>
  );

  // Componente: Resumen del Carrito
  const renderCartSummary = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Detalles de la Compra</h2>
      <div className="space-y-4">
        {cartItems?.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.quantity} × ${item.price?.toFixed(2)}
              </p>
            </div>
            <span className="font-medium">
              ${(item.quantity * item.price)?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>${cartTotal?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  // Componente: Sección de Pago
  const renderPaymentSection = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Método de Pago</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium">Saldo Disponible:</span>
          <span className="text-blue-600 font-semibold">
            ${userBalance?.toFixed(2)}
          </span>
        </div>
        
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
            <div
              className="flex flex-col justify-center bg-blue-500 transition-all duration-500"
              style={{ 
                width: `${Math.min((userBalance / cartTotal) * 100 || 0, 100)}%`,
                height: '0.5rem'
              }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || userBalance < cartTotal}
        className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
          loading || userBalance < cartTotal
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Procesando...' : 'Confirmar Pago'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Finalizar Compra</h1>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {loading && renderLoader()}
      {isSuccess && renderSuccess()}

      {!loading && !isSuccess && (
        <div className="grid gap-6 md:grid-cols-2">
          {renderCartSummary()}
          {renderPaymentSection()}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;