import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const QREntry = () => {
    const { orgId, tableNumber } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animationPhase, setAnimationPhase] = useState('initial');
    const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com/restaurants';

    const animationStyles = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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

                    // Animation sequence
                    const sequence = async () => {
                        setAnimationPhase('appLogoEnter');
                        await new Promise(r => setTimeout(r, 1200));
                        setAnimationPhase('restaurantLogoEnter');
                        await new Promise(r => setTimeout(r, 1200));
                        setAnimationPhase('infoAppear');
                        await new Promise(r => setTimeout(r, 1800));

                        // Redirect to /home
                        sessionStorage.setItem('justSetOrgIdAndTable', 'true');
                        window.location.href = '/home';
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
        background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
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
        textAlign: 'center',
        overflow: 'hidden',
    };

    const cardStyle = {
        padding: '25px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        opacity: animationPhase !== 'initial' ? 1 : 0,
        transition: 'opacity 0.8s ease-out',
        animation: animationPhase === 'infoAppear' ? 'fadeInUp 1.2s ease-in-out' : 'none',
    };

    const appLogoStyle = {
        width: '80px',
        height: 'auto',
        marginBottom: '20px',
        opacity: animationPhase === 'appLogoEnter' ? 1 : 0,
        transform: animationPhase === 'appLogoEnter' ? 'translateY(0)' : 'translateY(-50px)',
        transition: 'all 0.8s ease-out',
    };

    const restaurantLogoStyle = {
        width: '70%',
        maxWidth: '120px',
        opacity: animationPhase === 'restaurantLogoEnter' || animationPhase === 'infoAppear' ? 1 : 0,
        transform: animationPhase === 'restaurantLogoEnter' ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.8s ease-out',
        animation: animationPhase === 'restaurantLogoEnter' ? 'pulse 2s infinite' : 'none',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <style>{animationStyles}</style>
                <div style={backgroundStyle} />
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{ fontSize: 50, color: '#fff' }}
                        />
                    }
                />
                <Text style={{ marginTop: '20px', color: '#fff', fontSize: '1.2rem' }}>
                    Loading, please wait...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={backgroundStyle} />
                <div style={cardStyle}>
                    <Title level={4} style={{ color: '#ff4d4f' }}>
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
                        <Title level={3} style={{ color: '#ff4d4f', margin: '20px 0' }}>
                            Welcome to {restaurant.name}
                        </Title>
                        <Text style={{ fontSize: '1.2rem', color: '#555' }}>
                            Table {tableNumber}
                        </Text>
                    </>
                )}
            </div>
        </div>
    );
};

export default QREntry;
