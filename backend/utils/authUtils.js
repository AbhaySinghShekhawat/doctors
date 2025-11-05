const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

/**
 * ✅ Generate JWT Token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in .env');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * ✅ Send Token + Cookie Response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token =generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true, // JS can't access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        patientProfile: user.patientProfile,
        researcherProfile: user.researcherProfile,
      },
    });
};

/**
 * ✅ Middleware: Protect Routes (works with Bearer token or Cookie)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Bearer Token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ Check Cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // 6️⃣ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    });
  }
};

/**
 * ✅ Middleware: Authorize by Role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.userType} not authorized`,
      });
    }
    next();
  };
};

// ✅ Export all functions
module.exports = {
  generateToken,
  sendTokenResponse,
  protect,
  authorize,
};
