const { verifyToken } = require('./jwtUtils');

const authenticate = (req, res, next) => {
  let token;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // If no token in header, check cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // If no token found in both places, reject request
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id; // Attach user ID to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
