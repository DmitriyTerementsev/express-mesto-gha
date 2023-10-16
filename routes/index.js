const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const {
  validateLogin,
  validateUser,
} = require('../validator/validator');

const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', routerUsers);
router.use('/cards', routerCards);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
