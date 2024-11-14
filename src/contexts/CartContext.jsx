import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);


  // const addToCart = (item) => {
  //   setCart((prevCart) => {
  //     const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
  //     if (existingItem) {
  //       return prevCart.map((cartItem) =>
  //         cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
  //       );
  //     }
  //     return [...prevCart, { ...item, quantity: 1 }];
  //   });
  // };
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, specialInstructions: item.specialInstructions || existingItem.specialInstructions, selectedTags: item.selectedTags || existingItem.selectedTags }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1, specialInstructions: item.specialInstructions || '', selectedTags: item.selectedTags || [] }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity, customizationDetails) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId); // Remove item if quantity is 0 or less
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQuantity,
                specialInstructions: customizationDetails?.specialInstructions || item.specialInstructions,
                selectedTags: customizationDetails?.selectedTags || item.selectedTags,
              }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}