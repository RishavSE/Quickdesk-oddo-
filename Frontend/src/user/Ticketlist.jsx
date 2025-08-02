import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]); // Always start with array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
  setLoading(true);
  setError('');

  try {
    const res = await axios.get('http://localhost:5000/api/tickets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Raw API response:', res.data); // 👈 Log here

    // Defensive check
    if (Array.isArray(res.data)) {
      setTickets(res.data);
    } else if (res.data && Array.isArray(res.data.tickets)) {
      setTickets(res.data.tickets);
    } else {
      console.error('Unexpected data format:', res.data); // 👈 Debug line
      setTickets([]);
      setError('Unexpected data format from server.');
    }
  } catch (err) {
    console.error('Error fetching tickets:', err);
    setError('Failed to load tickets.');
    setTickets([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!tickets.length) return <p>No tickets found.</p>;

  return (
    <section>
      <h2>Your Tickets</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 10,
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#004aad', color: 'white' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Title</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Created At</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{ticket.title}</td>
              <td
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  textTransform: 'capitalize',
                  color:
                    ticket.status === 'resolved'
                      ? 'green'
                      : ticket.status === 'pending'
                      ? 'orange'
                      : 'black',
                  fontWeight: 'bold',
                }}
              >
                {ticket.status}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {new Date(ticket.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {ticket.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TicketList;
