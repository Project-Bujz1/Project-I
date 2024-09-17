import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodLoader from './FoodLoader';

const API_URL = 'https://smartserver-json-server.onrender.com/restaurants';

const QREntry = () => {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        if (!loading && !error && restaurant) {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 1500); // Navigate after 1.5 seconds

            return () => clearTimeout(timer);
        }
    }, [loading, error, restaurant, navigate]);

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

    return (
        <div style={{ textAlign: 'center', padding: '20px' , marginTop: '75px'}}>
            <h2>Welcome to {restaurant.name}</h2>
            <img src={restaurant.logo} alt={restaurant.name} style={{ maxWidth: '200px', margin: '20px 0' }} />
        </div>
    );
};

export default QREntry;