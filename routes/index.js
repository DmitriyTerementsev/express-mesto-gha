const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');

router.use('/users', routerUsers);
router.use('/cards', routerCards);

router.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
