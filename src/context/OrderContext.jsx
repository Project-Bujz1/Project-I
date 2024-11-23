import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const orgId = localStorage.getItem('orgId');

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      const ordersArray = Object.entries(data)
        .map(([key, order]) => ({
          ...order,
          id: order.id || key
        }))
        .filter(order => order.orgId === orgId);

      const sortedOrders = ordersArray?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId, updates) => {
    try {
      await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history/${orderId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to update order:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orgId]);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      loading, 
      setOrders,
      updateOrder,
      fetchOrders 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 