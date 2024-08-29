// import React from 'react';
// import { useCart } from '../contexts/CartContext';

// function OrderSummary() {
//   const { cart } = useCart();

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="container mx-auto px-4 pt-16">
//       <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//       {cart.map((item) => (
//         <div key={item.id} className="flex justify-between py-2">
//           <span>{item.name} x {item.quantity}</span>
//           <span>₹{(item.price * item.quantity).toFixed(2)}</span>
//         </div>
//       ))}
//       <div className="border-t mt-4 pt-4">
//         <div className="flex justify-between font-bold">
//           <span>Total</span>
//           <span>₹{total.toFixed(2)}</span>
//         </div>
//       </div>
//       <button className="w-full bg-red-600 text-white py-2 rounded mt-8">
//         Pay at Counter
//       </button>
//     </div>
//   );
// }

// export default OrderSummary;

import React from 'react';
import { useCart } from '../contexts/CartContext';

function OrderSummary() {
  const { cart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="order-summary-container" style={{marginTop: "75px"}}>
      <h2 className="order-summary-title">Order Summary</h2>
      {cart.map((item) => (
        <div key={item.id} className="order-item">
          <span className="item-name">{item.name} x {item.quantity}</span>
          <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="order-summary-total">
        <div className="total-line">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <button className="pay-button">Pay at Counter</button>
    </div>
  );
}

export default OrderSummary;
