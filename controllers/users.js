const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnathorizedError');
const { RES_OK } = require('../errors/GoodRequest');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(RES_OK).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Произошла ошибка: Пользователь с данным id не найден'
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Произошла ошибка: Пользователь с данным id не найден'
          )
        );
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(RES_OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Произошла ошибка: Переданы некорректные данные пользователя'
          )
        );
      }
      if (err.code === 11000) {
        return next(
          new BadRequestError(
            'Произошла ошибка: Такой пользователь уже существует'
          )
        );
      }
      return next(err);
    });
};

module.exports.changeInfo = (req, res) => {
  console.log(req.user._id);
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Произошла ошибка: Пользователь с данным id не найден'
        );
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'роизошла ошибка: Переданы некорректные данные пользователя'
          )
        );
      } else if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Произошла ошибка: Пользователь с данным id не найден'
          )
        );
      } else {
        next(err);
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
      upsert: false,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Произошла ошибка: Пользователь с данным id не найден'
        );
      }
      res.status(RES_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(
          new BadRequestError('При запросе пользователя id передан некорректно')
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, KEY, { expiresIn: '7d' });
      res.status(RES_OK).send({ token });
    })
    .catch(next);
};
