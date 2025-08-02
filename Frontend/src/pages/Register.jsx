import React, { useState } from 'react';
import axios from 'axios'; // ✅ import Axios
import '../pages/auth.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      alert("registered sucessfully "); // Or show using toast
      navigate('/login'); // Redirect to login
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form glass-effect" onSubmit={handleSubmit}>
        <h2 className="auth-heading">Create your QuickDesk account</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Choose Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="agent">Support Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="auth-btn">Register</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
