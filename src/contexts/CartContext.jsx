import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === book.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartTotal,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};