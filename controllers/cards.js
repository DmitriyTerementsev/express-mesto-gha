const badRequest = 400;
const notFound = 404;
const internalServerError = 500;
const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка при получении всех карточек' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(notFound).send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Произошла ошибка: Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};
