import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SupportDashboard.css'; // your external CSS

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentMap, setCommentMap] = useState({});

  // Fetch tickets from backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setTickets([]);

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('User not logged in');

      const role = user.role;
      if (role !== 'admin' && role !== 'agent') {
        throw new Error('Access denied: only admin or agent can fetch all tickets');
      }

      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tickets/agent', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Tickets fetched:', response.data);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found.');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/tickets/update/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTickets();
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
    }
  };

  // Submit comment for a ticket
  const handleCommentSubmit = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found.');
        return;
      }

      const comment = commentMap[ticketId];
      if (!comment) return;

      await axios.put(
        `http://localhost:5000/api/tickets/update/${ticketId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTickets();
      setCommentMap((prev) => ({ ...prev, [ticketId]: '' }));
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="support-dashboard">
      <aside className="sidebar">
        <h2>QuickDesk</h2>
        <nav>
          <button onClick={fetchTickets}>Dashboard</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1>Support Agent Dashboard</h1>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div className="ticket-card" key={ticket._id}>
                <h3>{ticket.subject || 'No Subject'}</h3>
                <p><strong>Email:</strong> {ticket.email || 'N/A'}</p>
                <p><strong>Message:</strong> {ticket.description || ticket.title || 'No message'}</p>
                <p><strong>Status:</strong> {ticket.status || 'Unknown'}</p>

                <div className="status-actions">
                  <button onClick={() => handleStatusChange(ticket._id, 'pending')}>Mark Pending</button>
                  <button onClick={() => handleStatusChange(ticket._id, 'resolved')}>Mark Resolved</button>
                </div>

                <div className="comment-section">
                  <textarea
                    value={commentMap[ticket._id] || ''}
                    onChange={(e) =>
                      setCommentMap((prev) => ({ ...prev, [ticket._id]: e.target.value }))
                    }
                    placeholder="Add a comment..."
                    rows={3}
                  />
                  <button onClick={() => handleCommentSubmit(ticket._id)}>Submit Comment</button>
                </div>

                {ticket.comments?.length > 0 && (
                  <div className="comments-history">
                    <h4>Previous Comments</h4>
                    <ul>
                      {ticket.comments.map((c, index) => (
                        <li key={index}>
                          <p>{c.text}</p>
                          <small>By: {c.commentedBy}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupportDashboard;
