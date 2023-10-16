const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

router.use(auth);

router.use('/users', routerUsers);
router.use('/cards', routerCards);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
