const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const Conflict = require('../errors/Conflict');
const ErrorData = require('../errors/ErrorData');
const WrongData = require('../errors/WrongData');
const NotFoundError = require('../errors/NotFoundError');

module.exports.postUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, email, password: hash,
  }))
    .then(() => res.status(200)
      .send({
        name, email,
      }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorData('Переданы неккоректные данные'));
        return;
      }
      if (error.code === 11000) {
        next(new Conflict('Пользователь с таким email уже создан'));
        return;
      }
      next(error);
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
      console.log(token);
    })
    .catch(() => {
      next(new WrongData('Передан неправильный email или пароль'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id).then((user) => {
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      next(new ErrorData('Неправильный id'));
      return;
    }
    next(error);
  });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorData('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};
