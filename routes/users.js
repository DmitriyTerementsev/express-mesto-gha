const routerUsers = require('express').Router();
const {
  getUsers, getUserById, createUser, changeInfo, changeAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserById);
routerUsers.post('/', createUser);
routerUsers.patch('/me', changeInfo);
routerUsers.patch('/me/avatar', changeAvatar);

module.exports = routerUsers;
