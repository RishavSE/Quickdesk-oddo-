import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = ({ onTicketCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/tickets',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Ticket created:', res.data);

      if (!res.data || typeof res.data !== 'object') {
        setError('Unexpected response from server.');
        return;
      }

      setTitle('');
      setDescription('');
      setSuccessMsg('Ticket created successfully!');

      // Fetch updated ticket list if callback provided
      if (onTicketCreated) onTicketCreated();

    } catch (err) {
      console.error('Ticket creation failed:', err);
      setError(
        err.response?.data?.message || 'Failed to create ticket.'
      );
    }
  };

  return (
    <section
      style={{
        marginBottom: 40,
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      <h2>Create a New Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: 6 }}>
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, fontSize: 16 }}
            placeholder="Enter ticket title"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: 6 }}>
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
            placeholder="Describe your issue"
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#004aad',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Submit Ticket
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: 10, fontWeight: 'bold' }}>{error}</p>
        )}
        {successMsg && (
          <p style={{ color: 'green', marginTop: 10, fontWeight: 'bold' }}>{successMsg}</p>
        )}
      </form>
    </section>
  );
};

export default TicketForm;
