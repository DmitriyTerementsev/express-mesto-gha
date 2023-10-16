const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnathorizedError');
const ConflictError = require('../errors/ConflictError');
const { RES_OK } = require('../errors/GoodRequest');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(RES_OK).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
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

module.exports.createUser = (req, res, next) => {
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
          new ConflictError(
            'Произошла ошибка: Такой пользователь уже существует'
          )
        );
      }
      return next(err);
    });
};

module.exports.changeInfo = (req, res, next) => {
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
            'Произошла ошибка: Переданы некорректные данные пользователя'
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

module.exports.changeAvatar = (req, res, next) => {
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
        next(
          new BadRequestError(
            'ППроизошла ошибка: Переданы некорректные данные пользователя'
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Произошла ошибка: Неверная почта или пароль')
        );
      }
      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(
          new UnauthorizedError('Произошла ошибка: Неверная почта или пароль')
        );
      }
      const token = jwt.sign({ _id: userId }, 'some-secret-key', {
        expiresIn: '7d',
      });
      return res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
    })
    .catch(next);
};
