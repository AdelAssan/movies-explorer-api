const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateProfile);

module.exports = router;
