const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnathorizedError");
const { RES_OK } = require("../errors/GoodRequest");

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
          "Произошла ошибка: Пользователь с данным id не найден"
        );
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Произошла ошибка: Пользователь с данным id не найден"
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
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Переданы некорректные данные пользователя")
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("Такой пользователь уже существует"));
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
        res.status(404).send({
          message: "Произошла ошибка: Пользователь с данным id не найден",
        });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({
          message: "Произошла ошибка: Данные переданы некорректно",
        });
      }
      return res.status(500).send({ message: "Произошла ошибка на сервере" });
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
        res.status(404).send({
          message: "Произошла ошибка: Пользователь с данным id не найден",
        });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Произошла ошибка: Данные переданы некорректно" });
      } else {
        res.status(500).send({ message: "Произошла ошибка на сервере" });
      }
    });
};
