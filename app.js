const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6521bea8d640d437b59db9b1',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.listen(PORT);
console.log(`Server listen on port ${PORT}`);

console.log(`Ссылка на сервер ${MONGO_URL}`);
