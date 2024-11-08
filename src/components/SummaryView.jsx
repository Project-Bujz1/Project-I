import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { 
  Button, 
  Card, 
  Modal, 
  List, 
  Typography, 
  Divider, 
  Space 
} from 'antd';
import { 
  DownloadOutlined, 
  ExclamationCircleOutlined, 
  ShoppingCartOutlined 
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Title, Text } = Typography;

function BillSummary() {
  const { cart } = useCart();
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const orgId = localStorage.getItem('orgId');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await fetch(`https://smart-server-stage-db-default-rtdb.firebaseio.com/restaurants.json`);

        if (response.ok) {
          const data = await response.json();

          // Check if data exists and filter by `orgId`
          if (data) {
            // Firebase stores data in a key-value format, so `data` is an object not an array
            const restaurant = Object.values(data).find(item => item.orgId === orgId);
            if (restaurant) {
              setRestaurantInfo(restaurant);
            } else {
              throw new Error('Organization not found');
            }
          }
        } else {
          throw new Error('Failed to fetch restaurant details');
        }
      } catch (error) {
        console.error(error);
        showErrorModal('Failed to fetch organization details.');
      }
    };

    if (orgId) {
      fetchRestaurantInfo();
    }
  }, [orgId]);

  
  const getImageUrl = (imageData) => {
    if (!imageData) return '';
    if (typeof imageData === 'string') return imageData;
    if (imageData.file?.url) return imageData.file.url;
    return '';
  };

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

    const doc = new jsPDF();

    // Styling constants
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const col1 = margin;
    const col2 = pageWidth - margin;
    let yPos = margin;
    
    // Add restaurant logo
    if (restaurantInfo.logo) {
      doc.addImage(restaurantInfo.logo, 'PNG', margin, yPos, 50, 20);
      yPos += 25;
    }
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Ensure black text
    doc.text(restaurantInfo.name || 'Restaurant Name', pageWidth / 2, yPos, { align: 'center' });
    
    // Restaurant details
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const address = restaurantInfo.address || 'N/A';
    const addressLines = doc.splitTextToSize(address, pageWidth - (2 * margin));
    doc.text(addressLines, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += (addressLines.length * 5) + 10;
    doc.text(`Tel: ${restaurantInfo.phone || 'N/A'}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`Email: ${restaurantInfo.email || 'N/A'}`, pageWidth / 2, yPos, { align: 'center' });
    
    // Bill details
    yPos += 15;
    doc.setDrawColor(0); // Black lines
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    const tableNumber = localStorage.getItem('tableNumber') || 'N/A'; // Fetch tableNumber from localStorage, default to 'N/A' if not found
    
    // Align Invoice No, Date, and Payment Status on the same row
    doc.text(`Invoice No: ${invoiceNumber}`, col1, yPos);
    doc.text(`Date: ${formattedDate}`, pageWidth / 2, yPos, { align: 'center' });
    doc.text('Payment Status: Unpaid', col2, yPos, { align: 'right' });
    
    yPos += 7;
    doc.text(`Table No: ${tableNumber}`, col1, yPos);
    doc.text(`Time: ${formattedTime}`, col2, yPos, { align: 'right' });
    
    // Items table
    yPos += 15;
    const headers = [['Item', 'Qty', 'Price', 'Amount']];
    const tableData = cart.map(item => [
      item.name,
      item.quantity.toString(),
      `₹${Number(item.price).toFixed(2)}`,
      `₹${(Number(item.price) * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: headers,
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      }
    });
    
    // Total
    yPos = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', col2 - 60, yPos);
    doc.text(`₹${total.toFixed(2)}`, col2, yPos, { align: 'right' });
    
    // Footer
    yPos = doc.internal.pageSize.height - 30;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('This is a computer-generated document. No signature required.', pageWidth / 2, yPos, { align: 'center' });
    
    // Generate filename with restaurant name, date and time
    const dateStr = currentDate.toISOString().split('T')[0];
    const timeStr = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `${restaurantInfo.name.replace(/\s+/g, '_')}_${dateStr}_${timeStr}.pdf`;
    
    doc.save(fileName);
  }; 
  return (
    <Card 
      className="bill-summary-container"
      style={{ 
        maxWidth: 800, 
        margin: '125px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Space align="center">
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
            <Title level={2} style={{ margin: 0 }}>Bill Summary</Title>
          </Space>
        </div>

        <List
  dataSource={cart}
  renderItem={item => {
    const price = Number(item.price) || 0; // Ensure price is a number, default to 0 if invalid
    return (
      <List.Item
        key={item.id}
        style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', marginBottom: '8px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <img 
            src={getImageUrl(item.image)} 
            alt={item.name}
            style={{ 
              width: 60, 
              height: 60, 
              objectFit: 'cover', 
              borderRadius: '4px',
              marginRight: '16px'
            }} 
          />
          <div style={{ flex: 1 }}>
            <Text strong>{item.name}</Text>
            <br />
            <Text type="secondary">Quantity: {item.quantity}</Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text strong>₹{(price * item.quantity).toFixed(2)}</Text>
            <br />
            <Text type="secondary">@₹{price.toFixed(2)}</Text>
          </div>
        </div>
      </List.Item>
    );
  }}
/>


        <div style={{ padding: '24px', background: '#f5f5f5', borderTop: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Total</Title>
            <Title level={4} style={{ margin: 0 }}>₹{total.toFixed(2)}</Title>
          </div>
        </div>

        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          size="large"
          block
          onClick={handleDownloadBill}
          className="cart-button"
          style={{
            backgroundColor: 'red',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'}}
        >
          Download Bill
        </Button>
      </Space>

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
    </Card>
  );
}

export default BillSummary;