import React, { createContext, useContext, useRef } from 'react';

const CartIconContext = createContext();

export function CartIconProvider({ children }) {
  const cartIconRef = useRef(null);

  return (
    <CartIconContext.Provider value={cartIconRef}>
      {children}
    </CartIconContext.Provider>
  );
}

export function useCartIcon() {
  return useContext(CartIconContext);
}