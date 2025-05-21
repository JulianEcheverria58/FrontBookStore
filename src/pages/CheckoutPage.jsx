import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { processPayment } from '../api/paymentApi';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!cart || cart.length === 0) {
      setErrorMessage('Tu carrito está vacío');
      setLoading(false);
      return;
    }

    setCartItems([...cart]);
    setUserBalance(user.membershipBalance || 0);
    setLoading(false);
  }, [user, cart, navigate]);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('No hay items para procesar. Por favor, agrega productos al carrito.');
      return;
    }

    if (userBalance < cartTotal) {
      setErrorMessage(`Saldo insuficiente. Necesitas $${cartTotal.toFixed(2)} (Saldo actual: $${userBalance.toFixed(2)})`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const paymentData = {
        userEmail: user.email,
        cartItems: cartItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        paymentMethod: 'membership'
      };

      const response = await processPayment(paymentData);

      if (!response.success) {
        throw new Error(response.message || 'Error al procesar el pago');
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Ocurrió un error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold">¡Compra exitosa!</h2>
          <p>Redirigiendo a tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Resumen de compra</h2>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg mt-4 pt-3">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">Método de pago</h2>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="font-medium">Saldo de membresía</p>
                <p className="text-gray-700 mt-1">
                  Saldo disponible: ${userBalance.toFixed(2)}
                </p>
                {userBalance < cartTotal && (
                  <p className="text-red-500 mt-2">Saldo insuficiente</p>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || userBalance < cartTotal}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  loading || userBalance < cartTotal
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Procesando pago...' : 'Confirmar compra'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Tu carrito está vacío. <a href="/" className="font-medium text-yellow-700 underline hover:text-yellow-600">Continúa comprando</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
