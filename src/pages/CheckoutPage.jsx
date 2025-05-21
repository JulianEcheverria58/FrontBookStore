import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { processPayment, getUserBalance } from '../api/paymentApi';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty');
    }

    const fetchBalance = async () => {
      try {
        const balance = await getUserBalance(user.email);
        setUserBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setErrorMessage('Error fetching user balance.');
      }
    };

    fetchBalance();
  }, [user, cartItems, navigate]);

  const safeCartTotal = typeof cartTotal === 'number' ? cartTotal : 0;
  const safeUserBalance = typeof userBalance === 'number' ? userBalance : 0;

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('There are no items to process');
      return;
    }

    if (safeUserBalance < safeCartTotal) {
      setErrorMessage(`Insufficient balance. You need $${safeCartTotal.toFixed(2)} (Current balance: $${safeUserBalance.toFixed(2)})`);
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
          price: typeof item.price === 'number' ? item.price : 0
        })),
        totalAmount: safeCartTotal,
        paymentMethod: 'membership'
      };

      const response = await processPayment(paymentData);

      if (!response.success) {
        throw new Error(response.message || 'Payment processing error');
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/profile'), 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An error occurred while processing the payment');
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
          <h2 className="text-xl font-bold">Purchase successful!</h2>
          <p>Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Purchase summary</h2>
              {cartItems.map(item => {
                const price = typeof item.price === 'number' ? item.price : 0;
                return (
                  <div key={item.id} className="flex justify-between py-3 border-b">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p>${(price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
              <div className="flex justify-between font-bold text-lg mt-4 pt-3">
                <span>Total:</span>
                <span>${safeCartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-3">Payment method</h2>
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="font-medium">Membership balance</p>
                <p className="text-gray-700 mt-1">
                  Available balance: ${safeUserBalance.toFixed(2)}
                </p>
                {safeUserBalance < safeCartTotal && (
                  <p className="text-red-500 mt-2">Insufficient balance</p>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || safeUserBalance < safeCartTotal}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  loading || safeUserBalance < safeCartTotal
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing payment...' : 'Confirm purchase'}
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
                Your cart is empty. <a href="/" className="font-medium text-yellow-700 underline hover:text-yellow-600">Continue shopping</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
