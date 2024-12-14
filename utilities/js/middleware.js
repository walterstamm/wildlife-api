const { StatusCodes } = require('http-status-codes');

const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
    });
  }
  next();
};

module.exports = {
  isAuthenticated,
};
