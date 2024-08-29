// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../contexts/CartContext';

// function Cart() {
//   const { cart, updateQuantity, removeFromCart } = useCart();

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="container mx-auto px-4 pt-16">
//       <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           {cart.map((item) => (
//             <div key={item.id} className="flex items-center justify-between border-b py-4">
//               <div>
//                 <h3 className="font-semibold">{item.name}</h3>
//                 <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
//                   className="bg-gray-200 px-2 py-1 rounded"
//                 >
//                   -
//                 </button>
//                 <span className="mx-2">{item.quantity}</span>
//                 <button
//                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                   className="bg-gray-200 px-2 py-1 rounded"
//                 >
//                   +
//                 </button>
//                 <button
//                   onClick={() => removeFromCart(item.id)}
//                   className="ml-4 text-red-600"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className="mt-8">
//             <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
//             <Link
//               to="/order-summary"
//               className="block w-full bg-red-600 text-white text-center py-2 rounded mt-4"
//             >
//               Place Order
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Cart;

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container" style={{marginTop: "75px"}}>
      <h2 className="cart-title">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">₹{item.price} x {item.quantity}</p>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="item-quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <p className="total-text">Total: ₹{total.toFixed(2)}</p>
            <Link
              to="/order-summary"
              className="place-order-button"
            >
              Place Order
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
