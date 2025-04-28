import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
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
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="md:col-span-2">
          {cartItems.map(item => (
            <div key={item.id} className="border-b py-6 flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-32 h-40 object-cover rounded"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-600">{item.author}</p>
                
                <div className="mt-4 flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                  >
                    +
                  </button>
                  
                  <span className="ml-6 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="self-start md:self-center text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Entire Cart
            </button>
            
            <Link 
              to="/checkout" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <Link 
            to="/checkout"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;