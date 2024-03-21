const jwt = require('jsonwebtoken');
const secretKey = "Mytoken123";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Token...', token);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }

    // If verification is successful, you can access the user information in decoded
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
