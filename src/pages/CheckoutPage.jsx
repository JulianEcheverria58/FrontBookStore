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
      console.error('Error getting IP:', error);
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
        setErrorMessage('Your cart is empty!');
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
        setErrorMessage('Some items are invalid');
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
        console.error('Error loading balance:', error);
        setErrorMessage('Error loading balance. Please refresh the page.');
        setUserBalance(0);
      }
    };

    loadBalance();
  }, [user, cartItems, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      if (userBalance < cartTotal) {
        throw new Error(`Insufficient balance: $${cartTotal.toFixed(2)} required (You have: $${userBalance.toFixed(2)})`);
      }

      const clientIp = await fetchClientIP();

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

      console.log('Sending payment:', paymentPayload);
      const paymentResult = await processPayment(paymentPayload);

      if (!paymentResult?.success) {
        throw new Error(paymentResult?.message || 'Payment processing failed');
      }

      try {
        const transactionResult = await transactionApi.createTransaction({
          userEmail: user.email,
          totalAmount: cartTotal,
          bookIds: cartItems.map(item => item.id),
          clientIp: clientIp
        });
        setTransactionId(transactionResult.id || paymentResult.transactionId);
      } catch (transactionError) {
        console.warn('Warning registering transaction:', transactionError);
        setTransactionId(paymentResult.transactionId || 'unregistered');
      }

      setIsSuccess(true);
      clearCart();
      setUserBalance(paymentResult.newBalance);

      setTimeout(() => navigate('/profile'), 2000);

    } catch (error) {
      console.error('Payment process error:', error);
      setErrorMessage(
        error.message.includes('User not found')
          ? 'Your session has expired. Please log in again.'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-3 text-gray-600">Processing transaction...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="p-6 text-center bg-green-50 rounded-lg">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <h2 className="mt-4 text-xl font-semibold">Purchase Successful!</h2>
      {transactionId && (
        <p className="mt-2 text-sm text-gray-600">
          Transaction ID: <span className="font-mono">{transactionId}</span>
        </p>
      )}
      <p className="mt-2 text-gray-600">
        New balance: <span className="font-semibold">${userBalance.toFixed(2)}</span>
      </p>
      <p className="mt-4 text-gray-600">Redirecting to your purchase history...</p>
    </div>
  );

  const renderCartSummary = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Order Details</h2>
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

  const renderPaymentSection = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium">Available Balance:</span>
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
        {loading ? 'Processing...' : 'Confirm Payment'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

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
