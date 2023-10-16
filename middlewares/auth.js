const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnathorizedError');

module.exports = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};