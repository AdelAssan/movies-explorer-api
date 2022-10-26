const Movie = require('../models/movie');
const ErrorData = require('../errors/ErrorData');
const NotFoundError = require('../errors/NotFoundError');
const WrongAction = require('../errors/WrongAction');

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movie) => res.send(movie))
    .catch((error) => next(error));
};

module.exports.postMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.body.movieId })
      .then(() => {
        return Movie.create({
          ...req.body,
          owner: req.user._id,
        });
      })
      .then((movie) => {
        res.send(movie);
      })
      .catch((error) => next(error));
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
