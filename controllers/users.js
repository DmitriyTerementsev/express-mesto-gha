const badRequest = 400;
const notFound = 404;
const internalServerError = 500;
const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка при получении списка пользователей' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Произошла ошибка: Пользователь с данным id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка при создании нового пользователя' }));
};

module.exports.changeInfo = (req, res) => {
  console.log(req.user._id);
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Произошла ошибка: Пользователь с данным id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Произошла ошибка: Пользователь с данным id не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
