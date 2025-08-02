const jwt = require('jsonwebtoken');

// Inside your login route, after verifying user credentials:
const token = jwt.sign(
  { userId: user._id, role: user.role, email: user.email }, // payload
  process.env.JWT_SECRET || 'your_jwt_secret_key',          // secret key
  { expiresIn: '1h' }                                       // token expiry
);

// Send token back to client
res.json({
  success: true,
  token,            // send the JWT token
  message: 'Login successful',
  user: {
    email: user.email,
    role: user.role,
  }
});
