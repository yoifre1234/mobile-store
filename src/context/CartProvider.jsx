import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(() => {
    const saved = localStorage.getItem('cartCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  // Función para establecer valor directo (opcional)
  const updateCartCount = (newCount) => {
    setCartCount(newCount); 
  };

  // --- ESTA ES LA QUE USAREMOS ---
  // Suma una cantidad al total existente
  const addCount = (quantity) => {
    setCartCount(prev => prev + quantity);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, addCount }}>
      {children}
    </CartContext.Provider>
  );
};