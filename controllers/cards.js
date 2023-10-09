const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении всех карточек' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Произошла ошибка при создании карточки',
        });
        return;
      }
      res.status(500).send({
        message: 'Произошла ошибка на сервере',
      });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      } else {
        res.status(201).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Произошла ошибка при удалении карточки',
        });
        return;
      }
      if (err.name === 'NotFoundError' || err.name === 'CastError') {
        res.status(404).send({
          message: 'Произошла ошибка при удалении карточки',
        });
        return;
      }
      res.status(500).send({
        message: 'Произошла ошибка на сервере',
      });
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
        return res
          .status(404)
          .send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      }
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(404).send({
          message: 'Произошла ошибка при установке лайка',
        });
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({
          message: 'Произошла ошибка при установке лайка',
        });
        return;
      }
      res.status(500).send({
        message: 'Произошла ошибка на сервере',
      });
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
        res
          .status(404)
          .send({ message: 'Произошла ошибка: Карточка c этим id не найдена' });
      } else {
        res.status(201).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(404).send({
          message: 'Произошла ошибка при удалении лайка',
        });
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({
          message: 'Произошла ошибка при удалении лайка',
        });
        return;
      }
      res.status(500).send({
        message: 'Произошла ошибка на сервере',
      });
    });
};
