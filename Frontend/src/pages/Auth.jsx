import React, { useState } from 'react';
import '../pages/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      await axios.post(`http://localhost:5000/api/${endpoint}`, formData);
      toast.success(`${isLogin ? 'Login' : 'Registration'} successful!`);
      navigate(isLogin ? '/dashboard' : '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'} to QuickDesk</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="agent">Support Agent</option>
          </select>
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
