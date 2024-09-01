// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import FoodLoader from './FoodLoader';

// function OrderConfirmation({ orderId }) {
//   const [orderStatus, setOrderStatus] = useState('Pending');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderStatus = async () => {
//       try {
//         const response = await fetch(`https://smartserver-json-server.onrender.com/${orderId}`);
//         const order = await response.json();
//         setOrderStatus(order.status || 'Pending');
//       } catch (error) {
//         console.error('Failed to fetch order status', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderStatus();

//     const interval = setInterval(fetchOrderStatus, 5000); // Fetch status every 5 seconds
//     return () => clearInterval(interval); // Clean up the interval on component unmount
//   }, [orderId]);

//   if (loading) {
//     return <FoodLoader />;
//   }

//   return (
//     <div className="order-confirmation-container">
//       <h2>{orderStatus === 'Ready' ? 'Your order is ready!' : 'Successfully Ordered!'}</h2>
//       <p>
//         {orderStatus === 'Preparing' 
//           ? 'Your order is being prepared, please wait... 😊' 
//           : 'Please wait, your order will arrive soon. 😊'}
//       </p>
//       <FoodLoader />

//       <div className="btn-container">
//         <Link to="/" className="order-button">
//           Order More Items
//         </Link>
//         <Link to="/order-summary" className="order-button">
//           Complete and Pay
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default OrderConfirmation;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import FoodLoader from './FoodLoader';

// function OrderConfirmation({ orderId }) {
//   const [orderStatus, setOrderStatus] = useState('pending');
//   const [statusMessage, setStatusMessage] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderStatus = async () => {
//       try {
//         const response = await fetch(`https://smartserver-json-server.onrender.com/${orderId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch order status');
//         }
//         const order = await response.json();
//         setOrderStatus(order.status || 'pending');
//         setStatusMessage(order.statusMessage || 'Your order is being processed');
//       } catch (error) {
//         console.error('Failed to fetch order status', error);
//         setStatusMessage('Unable to fetch order status');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderStatus();

//     const interval = setInterval(fetchOrderStatus, 5000); // Fetch status every 5 seconds
//     return () => clearInterval(interval); // Clean up the interval on component unmount
//   }, [orderId]);

//   if (loading) {
//     return <FoodLoader />;
//   }

//   const getStatusColor = () => {
//     switch (orderStatus) {
//       case 'ready':
//         return 'green';
//       case 'preparing':
//         return 'blue';
//       case 'delayed':
//         return 'orange';
//       default:
//         return 'gray';
//     }
//   };

//   return (
//     <div className="order-confirmation-container">
//       <h2 style={{ color: getStatusColor() }}>
//         {orderStatus === 'ready' ? 'Your order is ready!' : 'Order Status'}
//       </h2>
//       <p>{statusMessage}</p>
//       {orderStatus !== 'ready' && <FoodLoader />}

//       <div className="btn-container">
//         <Link to="/" className="order-button">
//           Order More Items
//         </Link>
//         {orderStatus === 'ready' && (
//           <Link to="/order-summary" className="order-button">
//             Complete and Pay
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// export default OrderConfirmation;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import FoodLoader from './FoodLoader';

// function OrderConfirmation({ orderId }) {
//   const [orderStatus, setOrderStatus] = useState('pending');
//   const [statusMessage, setStatusMessage] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderStatus = async () => {
//       try {
//         const response = await fetch(`https://smartserver-json-server.onrender.com/${orderId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch order status');
//         }
//         const order = await response.json();
//         setOrderStatus(order.status || 'pending');
//         setStatusMessage(order.statusMessage || 'Your order is being processed');
//       } catch (error) {
//         console.error('Failed to fetch order status', error);
//         setStatusMessage('Unable to fetch order status');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderStatus();

//     const interval = setInterval(fetchOrderStatus, 5000); // Fetch status every 5 seconds
//     return () => clearInterval(interval); // Clean up the interval on component unmount
//   }, [orderId]);

//   if (loading) {
//     return <FoodLoader />;
//   }

//   const getStatusColor = () => {
//     switch (orderStatus) {
//       case 'ready':
//         return 'green';
//       case 'preparing':
//         return 'blue';
//       case 'delayed':
//         return 'orange';
//       default:
//         return 'gray';
//     }
//   };

//   return (
//     <div className="order-confirmation-container">
//       <h2 style={{ color: getStatusColor() }}>
//         {orderStatus === 'ready' ? 'Your order is ready!' : `Order Status: ${orderStatus.toUpperCase()}`}
//       </h2>
//       <p>{statusMessage}</p>
//       {orderStatus !== 'ready' && <FoodLoader />}

//       <div className="btn-container">
//         <Link to="/" className="order-button">
//           Order More Items
//         </Link>
//         {orderStatus === 'ready' && (
//           <Link to="/order-summary" className="order-button">
//             Complete and Pay
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

// export default OrderConfirmation;

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import FoodLoader from './FoodLoader';

function OrderConfirmation() {
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`https://smartserver-json-server.onrender.com/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order status');
        }
        const order = await response.json();
        setOrderStatus(order.status || 'Pending');
        setStatusMessage(order.statusMessage || '');
      } catch (error) {
        console.error('Failed to fetch order status', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    const interval = setInterval(fetchOrderStatus, 5000); // Fetch status every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [orderId]);

  if (loading) {
    return <FoodLoader />;
  }

  return (
    <div className="order-confirmation-container">
      <h2>Order Status: {orderStatus}</h2>
      <p>{statusMessage}</p>
      <FoodLoader />

      <div className="btn-container">
        <Link to="/" className="order-button">
          Order More Items
        </Link>
        <Link to="/order-summary" className="order-button">
          View Order Summary
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;