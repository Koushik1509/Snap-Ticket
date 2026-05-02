const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, createMovieReview } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMovies)
  .post(protect, admin, createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

router.route('/:id/reviews').post(protect, createMovieReview);

module.exports = router;
