import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import FoodLoader from './FoodLoader';
import './landing-page.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://smart-server-3.onrender.com';

const LandingPage = () => {
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isAdminLogin) {
                const response = await fetch(`${API_URL}/api/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('role', 'admin');
                    localStorage.setItem('orgId', data.orgId);  // Store the orgId
                    navigate('/admin');
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Invalid credentials. Please try again.');
                }
            } else {
                localStorage.setItem('role', 'customer');
                navigate('/Home');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                        <div className="input-group">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
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