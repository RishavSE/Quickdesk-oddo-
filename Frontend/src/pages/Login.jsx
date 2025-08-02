import React, { useState } from 'react';
import '../pages/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Logging in with:', { email, password, role });

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });

      console.log('✅ Login response:', res.data);

      if (res.data.token) {
        const { token, role: returnedRole, email: returnedEmail, name } = res.data;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email: returnedEmail, role: returnedRole, name }));

        console.log('📦 Saved in localStorage:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user'),
        });

        // Redirect based on role
        if (returnedRole === 'admin') {
          navigate('/adminpannel1');
        } else if (returnedRole === 'agent') {
          navigate('/support-dashboard');
        } else {
          navigate('/user-dashboard');
        }

      } else {
        alert(res.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed, please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login to QuickDesk</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Select Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="agent">Support Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="auth-btn">Login</button>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
