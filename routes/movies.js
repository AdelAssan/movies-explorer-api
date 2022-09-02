const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const reg = require('../constant/constant');

const {
  getMovies, postMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(reg),
    trailerLink: Joi.string().required().pattern(reg),
    thumbnail: Joi.string().required().pattern(reg),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
