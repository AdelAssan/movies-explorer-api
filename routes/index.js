const { celebrate, Joi } = require('celebrate');
const index = require('express').Router();
const { postUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

index.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), postUser);
index.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), loginUser);

index.use('/', auth, require('./users'));
index.use('/', auth, require('./movies'));

index.use('*', (_, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = index;
