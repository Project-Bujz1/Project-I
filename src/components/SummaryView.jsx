import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button, Modal, message } from 'antd';
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function BillSummary() {
  const { cart } = useCart();
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const orgId = localStorage.getItem('orgId'); // Fetch orgId from localStorage
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch restaurant/organization details from the API
  useEffect(() => {
    if (orgId) {
      fetch(`https://smartserver-json-server.onrender.com/restaurants/${orgId}`)
        .then((response) => response.json())
        .then((data) => {
          setRestaurantInfo(data);
        })
        .catch((error) => {
          showErrorModal('Failed to fetch organization details.');
        });
    }
  }, [orgId]);

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };
  const handleDownloadBill = () => {
    if (cart.length === 0) {
      showErrorModal('No items in the cart to generate a bill.');
      return;
    }
  
    if (!restaurantInfo) {
      showErrorModal('No restaurant details available.');
      return;
    }
  
    const doc = new jsPDF('p', 'pt', 'a4');
  
    // Header with dynamic Restaurant name/logo
    doc.setFontSize(22);
    doc.setTextColor('#2c3e50');
    doc.text(restaurantInfo.name || 'Restaurant Name', 40, 40);
  
    doc.setFontSize(12);
    doc.setTextColor('#34495e');
    
    // Handle long address text by splitting it into multiple lines
    const address = restaurantInfo.address || 'N/A';
    const addressLines = doc.splitTextToSize(`Address: ${address}`, 250); // Wrap the text within 250pt width
    doc.text(addressLines, 40, 60);
    
    // Adjust the vertical position depending on how many lines the address occupies
    const phoneYPosition = 60 + addressLines.length * 15; // 15 is the line height
    doc.text(`Phone: ${restaurantInfo.phone || 'N/A'}`, 40, phoneYPosition);
    doc.text(`Email: ${restaurantInfo.email || 'N/A'}`, 40, phoneYPosition + 15);
  
    // Bill/Invoice details
    const invoiceNumber = Math.floor(Math.random() * 1000000);
    doc.setFontSize(16);
    doc.text('Invoice/Bill', 400, 40);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceNumber}`, 400, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 75);
    doc.text(`Table No: ${restaurantInfo.table || '5'}`, 400, 90); // Assuming table number 5 for demo purposes
  
    // Drawing a line under header
    doc.setDrawColor(180, 180, 180);
    doc.line(40, 100, 550, 100);
  
    // Table for items
    const tableData = cart.map((item) => [
      item.name,
      item.quantity,
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]);
  
    doc.autoTable({
      startY: 120,
      head: [['Item', 'Quantity', 'Price (₹)', 'Total (₹)']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: '#2c3e50' },
      styles: { fontSize: 10 },
    });
  
    // Total amount
    doc.setFontSize(14);
    doc.text(`Total: ₹${total.toFixed(2)}`, 40, doc.lastAutoTable.finalY + 20);
  
    // Footer: Thank you note and contact info
    doc.setFontSize(12);
    doc.setTextColor('#2c3e50');
    doc.text('Thank you for dining with us!', 40, doc.lastAutoTable.finalY + 60);
    doc.text(
      `For any queries, contact us at ${restaurantInfo.phone || '+123 456 7890'} or ${restaurantInfo.email || 'info@restaurant.com'}`,
      40,
      doc.lastAutoTable.finalY + 75
    );
  
    // Footer styling: drawing a line and adding spacing
    doc.setDrawColor(180, 180, 180);
    doc.line(40, doc.lastAutoTable.finalY + 50, 550, doc.lastAutoTable.finalY + 50);
  
    doc.save(`Bill_${invoiceNumber}.pdf`);
  };
  
//   const handleDownloadBill = () => {
//     if (cart.length === 0) {
//       showErrorModal('No items in the cart to generate a bill.');
//       return;
//     }

//     if (!restaurantInfo) {
//       showErrorModal('No restaurant details available.');
//       return;
//     }

//     const doc = new jsPDF('p', 'pt', 'a4');

//     // Header with dynamic Restaurant name/logo
//     doc.setFontSize(22);
//     doc.setTextColor('#2c3e50');
//     doc.text(restaurantInfo.name || 'Restaurant Name', 40, 40);

//     doc.setFontSize(12);
//     doc.setTextColor('#34495e');
//     doc.text(`Address: ${restaurantInfo.address || 'N/A'}`, 40, 60);
//     doc.text(`Phone: ${restaurantInfo.phone || 'N/A'}`, 40, 75);
//     doc.text(`Email: ${restaurantInfo.email || 'N/A'}`, 40, 90);

//     // Bill/Invoice details
//     const invoiceNumber = Math.floor(Math.random() * 1000000);
//     doc.setFontSize(16);
//     doc.text('Invoice/Bill', 400, 40);
//     doc.setFontSize(12);
//     doc.text(`Invoice No: ${invoiceNumber}`, 400, 60);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 75);
//     doc.text(`Table No: ${restaurantInfo.table || '5'}`, 400, 90); // Assuming table number 5 for demo purposes

//     // Drawing a line under header
//     doc.setDrawColor(180, 180, 180);
//     doc.line(40, 100, 550, 100);

//     // Table for items
//     const tableData = cart.map((item) => [
//       item.name,
//       item.quantity,
//       `₹${item.price.toFixed(2)}`,
//       `₹${(item.price * item.quantity).toFixed(2)}`,
//     ]);

//     doc.autoTable({
//       startY: 120,
//       head: [['Item', 'Quantity', 'Price (₹)', 'Total (₹)']],
//       body: tableData,
//       theme: 'striped',
//       headStyles: { fillColor: '#2c3e50' },
//       styles: { fontSize: 10 },
//     });

//     // Total amount
//     doc.setFontSize(14);
//     doc.text(`Total: ₹${total.toFixed(2)}`, 40, doc.lastAutoTable.finalY + 20);

//     // Footer: Thank you note and contact info
//     doc.setFontSize(12);
//     doc.setTextColor('#2c3e50');
//     doc.text('Thank you for dining with us!', 40, doc.lastAutoTable.finalY + 60);
//     doc.text(
//       `For any queries, contact us at ${restaurantInfo.phone || '+123 456 7890'} or ${restaurantInfo.email || 'info@restaurant.com'}`,
//       40,
//       doc.lastAutoTable.finalY + 75
//     );

//     // Footer styling: drawing a line and adding spacing
//     doc.setDrawColor(180, 180, 180);
//     doc.line(40, doc.lastAutoTable.finalY + 50, 550, doc.lastAutoTable.finalY + 50);

//     doc.save(`Bill_${invoiceNumber}.pdf`);
//   };

  return (
    <div className="bill-summary-container" style={{ marginTop: '95px' }}>
      <h2 className="bill-summary-title">Bill Summary</h2>
      {cart.map((item) => (
        <div key={item.id} className="order-item">
          <span className="item-name">
            {item.name} x {item.quantity}
          </span>
          <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="order-summary-total">
        <div className="total-line">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownloadBill}
        style={{ marginTop: '20px' }}
      >
        Download Bill
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            Error
          </div>
        }
        visible={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setErrorModalVisible(false)}
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
          >
            OK
          </Button>,
        ]}
        centered
        bodyStyle={{ backgroundColor: '#fff5f5', color: '#ff4d4f', textAlign: 'center' }}
      >
        <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>{errorMessage}</p>
      </Modal>
    </div>
  );
}

export default BillSummary;
