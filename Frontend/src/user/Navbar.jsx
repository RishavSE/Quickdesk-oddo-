import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav
      style={{
        backgroundColor: '#004aad',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>QuickDesk</div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 15 }}>
              Welcome, <strong>{user.name || user.email}</strong>
            </span>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/login"
            style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
