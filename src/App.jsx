import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderSummary from './pages/OrderSummary';
import { CartProvider } from './contexts/CartContext';
import './styles/main.css';
import AdminPage from './components/AdminPage';
import OrderHistory from './components/OrderHistory';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header toggleDrawer={toggleDrawer} />
          <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPage/>} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
