const routerUsers = require('express').Router();
const {
  getUsers, getUserById, createUser, changeInfo, changeAvatar,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/users/:userId', getUserById);
routerUsers.post('/', createUser);
routerUsers.patch('/users/me', changeInfo);
routerUsers.patch('/users/me/avatar', changeAvatar);

module.exports = routerUsers;
