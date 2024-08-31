import React, { useRef } from 'react';
import Header from './Header';
import { useCart } from '../contexts/CartContext';

function Layout({ children }) {
  const cartIconRef = useRef(null);
  const { cart } = useCart();

  return (
    <div className="layout">
      <Header toggleDrawer={() => {/* Implement drawer toggle */}} cartIconRef={cartIconRef} />
      <main className="main-content">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { cartIconRef });
          }
          return child;
        })}
      </main>
    </div>
  );
}

export default Layout;