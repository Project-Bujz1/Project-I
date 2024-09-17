import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FoodLoader from './FoodLoader';

const API_URL = 'https://smartserver-json-server.onrender.com/restaurants';

const QREntry = () => {
    const { orgId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogo, setShowLogo] = useState(false);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurant data');
                }
                const data = await response.json();
                const restaurantData = data.find(r => r.orgId === orgId);
                
                if (restaurantData) {
                    setRestaurant(restaurantData);
                    localStorage.setItem('role', 'customer');
                    localStorage.setItem('orgId', orgId);
                    
                    // Show logo for 3 seconds
                    setShowLogo(true);
                    setTimeout(() => {
                        // Set a flag in sessionStorage to indicate that we've just set the orgId
                        sessionStorage.setItem('justSetOrgId', 'true');
                        // Reload the page
                        window.location.reload();
                    }, 2000);
                } else {
                    throw new Error('Restaurant not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orgId) {
            fetchRestaurantData();
        } else {
            setError('No orgId provided');
            setLoading(false);
        }
    }, [orgId]);

    useEffect(() => {
        // Check if we've just reloaded after setting the orgId
        const justSetOrgId = sessionStorage.getItem('justSetOrgId');
        if (justSetOrgId) {
            // Clear the flag
            sessionStorage.removeItem('justSetOrgId');
            // Redirect to home page
            window.location.href = '/home';
        }
    }, []);

    if (loading) {
        return (
            <div style={{marginTop: '75px'}}>
                <FoodLoader />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!restaurant) {
        return <div>Restaurant not found</div>;
    }

    if (showLogo) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh', 
                backgroundColor: '#f0f0f0' 
            }}>
                <img 
                    src={restaurant.logo} 
                    alt={restaurant.name} 
                    style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        // objectFit: 'contain',
                        margin : '20px 0'  
                    }} 
                />
                <h2 style={{ marginTop: '20px', color: '#333' }}>Welcome to {restaurant.name}</h2>
                <p>Redirecting to home page...</p>
            </div>
        );
    }

    // This return statement will only be reached if there's a problem with the reload
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Welcome to {restaurant.name}</h2>
            <p>Redirecting to home page...</p>
        </div>
    );
};

export default QREntry;