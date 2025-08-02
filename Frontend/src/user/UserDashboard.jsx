import React from 'react';
import Navbar from './Navbar';
import TicketForm from './Ticketform';
import TicketList from './Ticketlist';

const UserDashboard = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // To refresh tickets in TicketList after new ticket created,
  // we'll lift state or trigger a callback. 
  // For simplicity, we'll use a key trick here:
  const [refreshKey, setRefreshKey] = React.useState(0);
  const refreshTickets = () => setRefreshKey((oldKey) => oldKey + 1);

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 15px' }}>
        <h1>User Dashboard</h1>

        {/* Pass refreshTickets callback to TicketForm */}
        <TicketForm onTicketCreated={refreshTickets} />

        {/* Pass refreshKey to TicketList to refetch tickets */}
        <TicketList key={refreshKey} />
      </div>
    </div>
  );
};

export default UserDashboard;
