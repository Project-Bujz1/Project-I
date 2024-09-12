import React, { useState, useEffect } from 'react';
import { Drawer, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MdRestaurant } from "react-icons/md";
import { HomeOutlined, ShoppingCartOutlined, FileTextOutlined, UnorderedListOutlined, HistoryOutlined, UserOutlined, SettingOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

const RestaurantDrawer = ({ isOpen, onClose }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      // Get orgId from localStorage
      const orgId = localStorage.getItem('orgId');
      
      if (!orgId) {
        console.error("No orgId found in localStorage");
        return;
      }
  
      // Fetch restaurant data from the server
      const response = await fetch('https://smartserver-json-server.onrender.com/restaurants');
      
      if (response.ok) {
        const data = await response.json();
        
        // Find the restaurant that matches the orgId
        const restaurant = data.find(restaurant => restaurant.orgId === orgId);
        
        if (restaurant) {
          // Set the restaurant name
          setRestaurantName(restaurant.name);
        } else {
          console.error("No restaurant found with the given orgId");
        }
      } else {
        console.error("Error fetching restaurant data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };
  

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img 
            src={process.env.PUBLIC_URL + '/assets/logo-transparent-png_1.png'} 
            alt="Smart Server" 
            className="logo-image" 
            style={{ height: '50px', width: '60px' }}
          />
          <span style={{ fontSize: '24px', fontFamily: 'Nerko One, sans-serif' }}>Menu</span>
          <img 
            src={process.env.PUBLIC_URL + '/assets/close.png'} 
            alt="Close" 
            className="logo-image" 
            onClick={onClose}
            style={{ 
              height: '30px', 
              width: '40px',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease-in-out',
              borderRadius: '50%' 
            }} 
            onMouseOver={e => e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.3)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          />
        </div>
      }
      placement="left"
      onClose={onClose}
      open={isOpen}
      width={300}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ background: '#f5222d', color: 'white' }}
      closeIcon={null}
    >
      <Menu
        mode="vertical"
        theme="light"
        style={{
          borderRight: 0,
          fontFamily: 'Nerko One, sans-serif',
          backgroundColor: 'white',
        }}
      >
        {/* Conditional Rendering for Customer */}
        {role === 'customer' && (
          <>
            <Menu.Item
              key="home"
              icon={<HomeOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{ margin: "20px" }}
            >
              <Link to="/home" onClick={onClose} style={{ fontWeight: 'bold', fontSize: "20px" }}>Home</Link>
            </Menu.Item>
            <Menu.Item
              key="cart"
              icon={<ShoppingCartOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{ margin: "20px" }}
            >
              <Link to="/cart" onClick={onClose} style={{ fontSize: "20px" }}>Cart</Link>
            </Menu.Item>
            <Menu.Item
              key="order-summary"
              icon={<FileTextOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{margin:"20px"}}
            >
              <Link to="/order-summary" onClick={onClose} style={{ fontSize: "20px" }}>Order Summary</Link>
            </Menu.Item>
          </>
        )}

        <Menu.Item
          key="order-history"
          icon={<HistoryOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
          className="menu-item"
          style={{ margin: "20px" }}
        >
          <Link to="/order-history" onClick={onClose} style={{ fontSize: "20px" }}>Order History</Link>
        </Menu.Item>

        {/* Conditional Rendering for Admin */}
        {role === 'admin' && (
          <>
            <Menu.Item
              key="admin"
              icon={<UserOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{ margin: "20px" }}
            >
              <Link to="/admin" onClick={onClose} style={{ fontSize: "20px" }}>Admin</Link>
            </Menu.Item>
            <Menu.Item
              key="menu-management"
              icon={<AppstoreOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{ margin: "20px" }}
            >
              <Link to="/menu-management" onClick={onClose} style={{ fontSize: "20px" }}>Menu Management</Link>
            </Menu.Item>
            <Menu.Item
              key="management"
              icon={<MdRestaurant style={{ fontWeight: 'bold', fontSize: "24px" }} />}
              className="menu-item"
              style={{ margin: "20px" }}
            >
              <Link to="/management" onClick={onClose} style={{ fontSize: "20px" }}>Restaurant Management</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        borderTop: '1px solid #f0f0f0', 
        padding: '10px', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.45)' }}>© 2024 {restaurantName || 'Restaurant Name'}</p>
      </div>
      <style>
        {`
          .menu-item.ant-menu-item-selected {
            background-color: #f5222d !important;
            color: white !important; 
          }
          .menu-item.ant-menu-item-selected a {
            color: white !important;
          }
        `}
      </style>
    </Drawer>
  );
};

export default RestaurantDrawer;