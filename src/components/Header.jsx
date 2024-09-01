import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Badge } from 'antd';
import { TiThMenu } from 'react-icons/ti';
import { AiOutlineShoppingCart, AiOutlineFileText } from 'react-icons/ai';
import { useCart } from '../contexts/CartContext';
import './Header.css';
import CartHitEffect from './CartHitEffect';

const { Search } = Input;

function Header({ toggleDrawer, onCartIconRefChange, onSearch }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartIconRef = useRef(null);
  const [showHitEffect, setShowHitEffect] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (onCartIconRefChange) {
      onCartIconRefChange(cartIconRef);
    }
  }, [onCartIconRefChange]);

  const handleOrderSummaryClick = () => {
    navigate('/order-summary');
  };

  const triggerHitEffect = () => {
    setShowHitEffect(true);
    setTimeout(() => setShowHitEffect(false), 300);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          <div className="header__left">
            <TiThMenu className="header__menu-button" onClick={toggleDrawer} />
            <Link to="/" className="header__logo">
              <img 
                src={process.env.PUBLIC_URL + '/assets/logo-transparent-png.png'} 
                alt="Smart Server" 
                className="header__logo-image" 
              />
              <span className="header__logo-text">Smart Server</span>
            </Link>
          </div>
          <div className="header__center">
            <Search
              placeholder="Search menu..."
              className="header__search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
          <div className="header__right">
            <AiOutlineFileText 
              onClick={handleOrderSummaryClick} 
              className="header__icon"
            />
            <Link to="/cart" className="header__cart-icon">
              <Badge count={cart.length} offset={[10, 0]}>
                <div ref={cartIconRef} style={{ position: 'relative' }}>
                  <AiOutlineShoppingCart className="header__icon" style={{marginTop: "8px"}} />
                  {showHitEffect && <CartHitEffect />}
                </div>
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;