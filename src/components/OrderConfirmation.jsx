import React from 'react';
import { Link } from 'react-router-dom';
import FoodLoader from './FoodLoader';


function OrderConfirmation() {
  return (
    <div className="order-confirmation-container">
      <h2>Successfully Ordered!</h2>
      <p>Please wait, your order will arrive soon. 😊</p>
      <FoodLoader />

      <div className="btn-container">
        <Link to="/" className="order-button">
          Order More Items
        </Link>
        <Link to="/order-summary" className="order-button">
          Complete and Pay
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
