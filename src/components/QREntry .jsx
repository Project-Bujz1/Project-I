import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Typography, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const QREntry = () => {
    const { orgId, tableNumber } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animationPhase, setAnimationPhase] = useState('initial');
    const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com/restaurants';

    // Animation keyframes as styles
    const pulseAnimation = {
        animation: 'pulse 2s infinite',
    };

    const fadeInUpAnimation = {
        animation: 'fadeInUp 0.8s forwards',
    };

    const rotateAnimation = {
        animation: 'rotate360 1s forwards',
    };

    // CSS animations
    const animationStyles = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes rotate360 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
    `;

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetch(`${API_URL}.json`);
                if (!response.ok) throw new Error('Failed to fetch restaurant data');
                
                const data = await response.json();
                const restaurantArray = Object.values(data);
                const restaurantData = restaurantArray.find(r => r.orgId === orgId);
                
                if (restaurantData) {
                    setRestaurant(restaurantData);
                    localStorage.setItem('role', 'customer');
                    localStorage.setItem('orgId', orgId);
                    localStorage.setItem('tableNumber', tableNumber);
                    
                    // Extended animation sequence
                    const sequence = async () => {
                        setAnimationPhase('appLogoEnter');
                        await new Promise(r => setTimeout(r, 1500));
                        setAnimationPhase('restaurantLogoEnter');
                        await new Promise(r => setTimeout(r, 1500));
                        setAnimationPhase('infoAppear');
                        await new Promise(r => setTimeout(r, 2000));
                        sessionStorage.setItem('justSetOrgIdAndTable', 'true');
                        window.location.reload();
                    };
                    sequence();
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

    useEffect(() => {
        const justSetOrgIdAndTable = sessionStorage.getItem('justSetOrgIdAndTable');
        if (justSetOrgIdAndTable) {
            sessionStorage.removeItem('justSetOrgIdAndTable');
            window.location.href = '/home';
        }
    }, []);

    const backgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            linear-gradient(135deg, #fff5f5 0%, #fff 100%),
            radial-gradient(circle at 50% 0%, #ffeded 0%, transparent 75%),
            repeating-linear-gradient(45deg, #ff000008 0px, #ff000008 2px, transparent 2px, transparent 8px)
        `,
        zIndex: -1,
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    };

    const appLogoStyle = {
        width: '120px',
        height: 'auto',
        opacity: animationPhase === 'initial' ? 0 : 1,
        transform: `translateY(${animationPhase === 'appLogoEnter' ? '0' : '-50px'})`,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: animationPhase === 'appLogoEnter' ? 'float 3s infinite ease-in-out' : 'none',
        marginBottom: '20px',
    };

    const restaurantLogoStyle = {
        maxWidth: '200px',
        width: '80%',
        opacity: animationPhase === 'restaurantLogoEnter' || animationPhase === 'infoAppear' ? 1 : 0,
        transform: `scale(${animationPhase === 'restaurantLogoEnter' || animationPhase === 'infoAppear' ? 1 : 0.8})`,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: animationPhase === 'restaurantLogoEnter' ? 'pulse 2s infinite ease-in-out' : 'none',
    };

    const cardStyle = {
        padding: '40px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 77, 79, 0.1)',
        width: '90%',
        maxWidth: '450px',
        transform: `translateY(${animationPhase !== 'initial' ? '0' : '20px'})`,
        opacity: animationPhase !== 'initial' ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const infoStyle = {
        opacity: animationPhase === 'infoAppear' ? 1 : 0,
        transform: `translateY(${animationPhase === 'infoAppear' ? '0' : '20px'})`,
        transition: 'all 0.8s ease-out',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <style>{animationStyles}</style>
                <div style={backgroundStyle} />
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <Spin 
                        indicator={
                            <LoadingOutlined 
                                style={{ 
                                    fontSize: 48, 
                                    color: '#ff4d4f',
                                    ...rotateAnimation 
                                }} 
                            />
                        } 
                    />
                    <Text style={{ 
                        marginTop: '20px', 
                        display: 'block',
                        color: '#ff4d4f',
                        fontSize: '1.1rem',
                        ...fadeInUpAnimation 
                    }}>
                        Preparing your experience...
                    </Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={backgroundStyle} />
                <div style={cardStyle}>
                    <Title level={4} style={{ color: '#ff4d4f', textAlign: 'center' }}>
                        {error}
                    </Title>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <style>{animationStyles}</style>
            <div style={backgroundStyle} />
            
            <img 
                src="/assets/logo-png_1.png"
                alt="App Logo"
                style={appLogoStyle}
            />
            
            <div style={cardStyle}>
                {restaurant && (
                    <>
                        <img
                            src={restaurant.logo}
                            alt={restaurant.name}
                            style={restaurantLogoStyle}
                        />
                        
                        <div style={infoStyle}>
                            <Title 
                                level={2} 
                                style={{ 
                                    color: '#ff4d4f',
                                    margin: '20px 0',
                                    fontSize: 'calc(1.5rem + 1vw)',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                }}
                            >
                                Welcome to {restaurant.name}
                            </Title>
                            
                            <div style={{
                                background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                                padding: '15px 25px',
                                borderRadius: '12px',
                                marginTop: '20px',
                            }}>
                                <Text 
                                    style={{ 
                                        fontSize: '1.2rem',
                                        color: 'white',
                                        display: 'block',
                                        textAlign: 'center',
                                    }}
                                >
                                    Table {tableNumber}
                                </Text>
                            </div>
                            
                            <div 
                                style={{ 
                                    marginTop: '30px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'rgba(255, 77, 79, 0.1)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                }}
                            >
                                <Spin size="small" />
                                <Text style={{ color: '#ff4d4f' }}>
                                    Preparing your menu...
                                </Text>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QREntry;