const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { postUser, loginUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const reg = require('./constant/constant');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const serverError = require('./middlewares/serverError');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(reg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), postUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);
app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/movies'));

app.use('*', (_, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());

app.use(serverError);

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.listen(PORT);
