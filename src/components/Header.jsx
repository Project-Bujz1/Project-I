import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Badge } from 'antd';
import { TiThMenu } from 'react-icons/ti';
import { AiOutlineShoppingCart, AiOutlineFileText } from 'react-icons/ai';
import { useCart } from '../contexts/CartContext';
import './Header.css';

const { Search } = Input;

function Header({ toggleDrawer, onCartIconRefChange }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartIconRef = useRef(null);

  useEffect(() => {
    if (onCartIconRefChange) {
      onCartIconRefChange(cartIconRef);
    }
  }, [onCartIconRefChange]);

  const handleOrderSummaryClick = () => {
    navigate('/order-summary');
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
            />
          </div>
          <div className="header__right">
            <AiOutlineFileText 
              onClick={handleOrderSummaryClick} 
              className="header__icon"
            />
            <Link to="/cart" className="header__cart-icon">
              <Badge count={cart.length} offset={[10, 0]}>
                <AiOutlineShoppingCart ref={cartIconRef} className="header__icon" style={{marginTop: "8px"}} />
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;