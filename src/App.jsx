import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderSummary from './pages/OrderSummary';
import { CartProvider } from './contexts/CartContext';
import { CartIconProvider } from './contexts/CartIconContext';
import './styles/main.css';
import AdminPage from './components/AdminPage';
import OrderHistory from './components/OrderHistory';
import OrderConfirmation from './components/OrderConfirmation';
import MenuManagement from './components/MenuManagement';
import WaitingScreen from './components/WaitingScreen';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleItemAdded = () => {
    // Logic for item added animation
  };

  return (
    <Router>
      <CartProvider>
        <CartIconProvider>
          <div className="App">
            <Header 
              toggleDrawer={toggleDrawer} 
              onSearch={handleSearch}
            />
            
            <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
            <div className="container">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Home 
                      onItemAdded={handleItemAdded}
                      searchTerm={searchTerm}
                    />
                  } 
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<AdminPage/>} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/menu-management" element={<MenuManagement />} />
                <Route path="/waiting/:orderId" element={<WaitingScreen />} /> {/* New route for WaitingScreen */}
              </Routes>
            </div>
          </div>
        </CartIconProvider>
      </CartProvider>
    </Router>
  );
}

export default App;