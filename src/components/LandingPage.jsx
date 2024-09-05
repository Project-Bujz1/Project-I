import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodLoader from './FoodLoader';
import './landing-page.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://smart-server-3.onrender.com';

const LandingPage = () => {
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isAdminLogin) {
        // Admin login logic
        const response = await fetch(`${API_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('role', 'admin'); // Set role as 'admin'
          navigate('/admin');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Invalid credentials. Please try again.');
        }
      } else {
        // Customer login logic (no credentials required)
        localStorage.setItem('role', 'customer'); // Set role as 'customer'
        navigate('/Home');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="landing-container">
      <img 
        src={process.env.PUBLIC_URL + '/assets/logo-transparent-png - Copy.png'} 
        alt="Logo"
        className="logo"
      />
      
      <div className="login-container">
        <h1 className="login-title">Welcome to Our Food Service</h1>
        
        {isAdminLogin ? (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Admin Login
            </button>
          </form>
        ) : (
          <button onClick={handleLogin} className="btn">
            Enter as Customer
          </button>
        )}
        
        <button 
          onClick={() => setIsAdminLogin(!isAdminLogin)} 
          className="btn btn-outline"
          style={{ marginTop: '1rem' }}
        >
          {isAdminLogin ? 'Switch to Customer' : 'Switch to Admin Login'}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading && <FoodLoader />}

        <div className="food-emojis">
          <span className="food-emoji">🍔</span>
          <span className="food-emoji">🍕</span>
          <span className="food-emoji">🌮</span>
          <span className="food-emoji">🍣</span>
          <span className="food-emoji">🍜</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;