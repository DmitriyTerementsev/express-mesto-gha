const routerCards = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCards);
routerCards.post('/', createCard);
routerCards.delete('/:cardId', deleteCardById);
routerCards.put('/:cardId/likes', likeCard);
routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
