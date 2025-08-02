import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ticketList.css';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found, redirect to login.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'pending') return 'status pending';
    if (status === 'in progress') return 'status in-progress';
    if (status === 'resolved') return 'status resolved';
    return 'status';
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/tickets/${selectedTicket._id}/comment`,
        { comment: commentText.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update selected ticket's comments locally
      const updatedTicket = { ...selectedTicket };
      updatedTicket.comments = response.data.comments;
      setSelectedTicket(updatedTicket);

      // Also update the ticket in the main tickets list
      setTickets((prev) =>
        prev.map((t) =>
          t._id === updatedTicket._id ? updatedTicket : t
        )
      );

      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-section">
      <h2>My Tickets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td className={getStatusClass(ticket.status)}>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedTicket(ticket)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Ticket Details */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTicket.title}</h3>
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Status:</strong> <span className={getStatusClass(selectedTicket.status)}>{selectedTicket.status}</span></p>
            <p><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>

            {/* Comment Section */}
            <div className="comment-section">
              <h4>Comments</h4>
              {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                <ul className="comment-list">
                  {selectedTicket.comments.map((comment, index) => (
                    <li key={index} className="comment-item">
                      <strong>{comment.author || 'Support'}:</strong> {comment.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}

              <div className="comment-form">
                <textarea
                  rows="3"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button
                  className="submit-btn"
                  onClick={handleCommentSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            <button className="close-btn" onClick={() => setSelectedTicket(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
