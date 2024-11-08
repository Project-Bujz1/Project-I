import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Utensils, Coffee, Pizza, ChefHat, Apple, Beer, 
  UtensilsCrossed, Sandwich, Wine, Soup, Cookie, Beef,
  BookOpen, Star, Clock, Bell, GlassWater
} from 'lucide-react';
import { Card, Typography, Spin, Alert, Progress } from 'antd';
const { Title, Text } = Typography;

const QREntry = () => {
    const { orgId, tableNumber } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const API_URL = 'https://smart-server-stage-db-default-rtdb.firebaseio.com/restaurants';

    const animationStyles = `
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        .floating-icon {
            animation: float 3s ease-in-out infinite;
            position: absolute;
            color: #ff4d4d;
            opacity: 0.2;
            filter: drop-shadow(0 4px 8px rgba(255, 77, 77, 0.3));
        }
        .pulse-icon {
            animation: pulse 2s ease-in-out infinite;
        }
        .gradient-text {
            background: linear-gradient(45deg, #ff4d4d, #ff8080, #ff4d4d);
            background-size: 200% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: shine 3s linear infinite;
        }
    `;

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Simulate loading progress
                const progressInterval = setInterval(() => {
                    setProgress(prev => (prev < 90 ? prev + 10 : prev));
                }, 200);

                const response = await fetch(`${API_URL}.json`);
                if (!response.ok) throw new Error('Failed to fetch restaurant data');

                const data = await response.json();
                const restaurantArray = Object.values(data);
                const restaurantData = restaurantArray.find(r => r.orgId === orgId);

                clearInterval(progressInterval);
                setProgress(100);

                if (restaurantData) {
                    setRestaurant(restaurantData);
                    localStorage.setItem('role', 'customer');
                    localStorage.setItem('orgId', orgId);
                    localStorage.setItem('tableNumber', tableNumber);

                    setTimeout(() => {
                        sessionStorage.setItem('justSetOrgIdAndTable', 'true');
                        window.location.href = '/home';
                    }, 1500);
                } else {
                    throw new Error('Restaurant not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orgId && tableNumber) {
            fetchRestaurantData();
        } else {
            setError('No orgId or tableNumber provided');
            setLoading(false);
        }
    }, [orgId, tableNumber]);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
    };

    const cardStyle = {
        width: '90%',
        maxWidth: '450px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(255, 77, 77, 0.15)',
        border: 'none',
        overflow: 'hidden'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <style>{animationStyles}</style>
                <Card style={cardStyle}>
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <img
                            src="/assets/logo-transparent-png - Copy.png"
                            alt="App Logo"
                            style={{ 
                                width: '120px',
                                marginBottom: '30px',
                                animation: 'pulse 2s infinite'
                            }}
                        />
                        <Title level={3} className="gradient-text" style={{ marginBottom: '30px' }}>
                            Loading Smart Server
                        </Title>
                        <Progress 
                            percent={progress} 
                            status="active"
                            strokeColor={{
                                '0%': '#ff4d4d',
                                '100%': '#ff8080',
                            }}
                        />
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <Card style={cardStyle}>
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ border: 'none', borderRadius: '12px' }}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <style>{animationStyles}</style>
            
            {/* Floating Background Icons */}
            <Utensils size={32} className="floating-icon" style={{ top: '10%', left: '10%' }} />
            <Coffee size={32} className="floating-icon" style={{ top: '20%', right: '15%' }} />
            <Pizza size={32} className="floating-icon" style={{ bottom: '15%', left: '20%' }} />
            <Beer size={32} className="floating-icon" style={{ bottom: '25%', right: '25%' }} />
            
            <Card style={cardStyle}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    {/* App Logo */}
                    <div style={{ marginBottom: '30px' }}>
                        <img
                            src="/assets/logo-transparent-png.png"
                            alt="App Logo"
                            style={{ 
                                width: '150px',
                                filter: 'drop-shadow(0 4px 12px rgba(255, 77, 77, 0.2))'
                            }}
                        />
                    </div>

                    {restaurant && (
                        <>
                            {/* Restaurant Logo */}
                            <div style={{ 
                                marginBottom: '30px',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto',
                                    border: '4px solid #ff4d4d',
                                    boxShadow: '0 8px 24px rgba(255, 77, 77, 0.2)'
                                }}>
                                    <img
                                        src={restaurant.logo}
                                        alt={restaurant.name}
                                        style={{ 
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Restaurant Name */}
                            <Title level={2} className="gradient-text" style={{ marginBottom: '20px' }}>
                                {restaurant.name}
                            </Title>

                            {/* Table Number */}
                            <Card
                                style={{
                                    background: 'linear-gradient(45deg, #ff4d4d, #ff8080)',
                                    borderRadius: '16px',
                                    border: 'none',
                                    maxWidth: '200px',
                                    margin: '0 auto'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    color: 'white'
                                }}>
                                    <Bell size={20} className="pulse-icon" />
                                    <Text strong style={{ color: 'white', fontSize: '18px' }}>
                                        Table {tableNumber}
                                    </Text>
                                    <GlassWater size={20} className="pulse-icon" />
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QREntry;