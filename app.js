const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');

const { errors } = require('celebrate');

const {
  validateLogin,
  validateUser,
} = require('./validator/validator');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const InternalServerError = require('./middlewares/error');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errors());
app.use(InternalServerError);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
console.log(`Server listen on port ${PORT}`);
console.log(`Ссылка на сервер ${MONGO_URL}`);
