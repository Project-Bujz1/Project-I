import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://https://smartserver-json-server.onrender.com/users?username=${username}&password=${password}`);
      const data = await response.json();
      if (data.length > 0) {
        onLogin(data[0]);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Foodie's Paradise</h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button style={styles.button} onClick={() => onLogin({ role: 'guest' })}>
        Continue as Guest
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'url(/assets/restaurant-background.jpg) no-repeat center center/cover',
  },
  heading: {
    fontSize: '2.5rem',
    color: 'white',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  input: {
    width: '300px',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
  },
  button: {
    width: '320px',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#e74c3c',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default Login;
