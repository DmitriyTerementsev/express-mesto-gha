const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use((req, res, next) => {
  req.user = {
    _id: '6520965142e27e8b6d01713c',
  };

  next();
});

async function init() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('DataBase Connect');

  app.listen(PORT);
  console.log(`Server listen on port ${PORT}`);

  console.log(`Ссылка на сервер ${MONGO_URL}`);
}

init();
