import React from 'react';
import { Drawer, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons';

const RestaurantDrawer = ({ isOpen, onClose }) => {
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
        <Menu.Item
          key="home"
          icon={<HomeOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
          className="menu-item"
          style={{margin:"20px"}}
        >
          <Link to="/" onClick={onClose} style={{ fontWeight: 'bold', fontSize: "20px" }}>Home</Link>
        </Menu.Item>
        <Menu.Item
          key="cart"
          icon={<ShoppingCartOutlined style={{ fontWeight: 'bold', fontSize: "24px" }} />}
          className="menu-item"
          style={{margin:"20px"}}
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
      </Menu>
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        borderTop: '1px solid #f0f0f0', 
        padding: '10px', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.45)' }}>© 2024 Restaurant Name</p>
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
