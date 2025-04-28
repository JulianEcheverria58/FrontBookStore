import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTimeout(() => {
      setOrderConfirmed(true);
      clearCart();
    }, 1500);
  };

  if (orderConfirmed) {
    return (
      <div className="container mx-auto p-4 py-12 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p>Thank you for your purchase.</p>
        </div>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Información del pedido */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cartItems.map(item => (
              <div key={item.id} className="border-b py-4 flex justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información de envío */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Membership Balance */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold mb-2">Membership Balance</p>
              <p className="font-bold">Available Balance: ${user?.balance?.toFixed(2) || '0.00'}</p>
              {cartTotal > (user?.balance || 0) && (
                <p className="text-red-500 text-sm mt-2">
                  Insufficient balance. Please add ${(cartTotal - (user?.balance || 0)).toFixed(2)} to complete purchase.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={cartTotal > (user?.balance || 0)}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                cartTotal > (user?.balance || 0)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm Order (${cartTotal.toFixed(2)})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;