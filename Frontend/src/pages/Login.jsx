import React, { useState } from 'react';
import '../pages/auth.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('user');

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2>Login to QuickDesk</h2>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
        </div>

        <div className="form-group">
          <label color='white'>Password</label>
          <input type="password" placeholder="Enter your password" required />
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
