const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateUser;
