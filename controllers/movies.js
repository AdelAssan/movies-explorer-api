const Movie = require('../models/movie');
const ErrorData = require('../errors/ErrorData');
const NotFoundError = require('../errors/NotFoundError');
const WrongAction = require('../errors/WrongAction');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((error) => next(error));
};

module.exports.postMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorData('Переданы неккоректные данные'));
        return;
      }
      next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new WrongAction('Чужой фильм');
      } else {
        return movie.remove().then(() => res.status(200).send(movie));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorData('Переданы неккоректные данные'));
        return;
      }
      next(error);
    });
};
