import React, { useRef, useState } from 'react';
import Header from './Header';
import { useCart } from '../contexts/CartContext';
import { MenuProvider } from '../context/MenuContext';
import { OrderProvider } from '../context/OrderContext';

function Layout({ children }) {
  const cartIconRef = useRef(null);
  const { cart } = useCart();
  const [triggerHitEffect, setTriggerHitEffect] = useState(false);

  const handleItemAdded = () => {
    setTriggerHitEffect(true);
    setTimeout(() => setTriggerHitEffect(false), 300);
  };

  return (
    <OrderProvider>
      <MenuProvider>
        <div className="layout">
          <Header 
            // toggleDrawer={() => {}} 
            cartIconRef={cartIconRef}
            triggerHitEffect={triggerHitEffect}
          />
          <main className="main-content">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { cartIconRef, onItemAdded: handleItemAdded });
              }
              return child;
            })}
          </main>
        </div>
      </MenuProvider>
    </OrderProvider>
  );
}

export default Layout;