import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaInfoCircle, FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const movieRes = await api.get(`/movies/${id}`);
        setMovie(movieRes.data);

        const showsRes = await api.get('/shows');
        const movieShows = showsRes.data.filter(s => s.movieId._id === id);
        setShows(movieShows);
      } catch (error) {
        console.error('Error fetching details', error);
      }
      setLoading(false);
    };
    fetchMovieAndShows();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      await api.post(`/movies/${id}/reviews`, { rating, comment });
      
      const movieRes = await api.get(`/movies/${id}`);
      setMovie(movieRes.data);
      setComment('');
      toast.success('Review submitted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-3xl">Loading...</div>;
  if (!movie) return <div className="text-center mt-20 text-xl">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 mt-8">
      {/* Movie Banner Area */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl min-h-[400px] flex items-center">
         {/* Background blurred poster */}
        <div className="absolute inset-0 hidden md:block">
           <img src={movie.posterUrl} alt="bg" className="w-full h-full object-cover blur-3xl opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        </div>
        
        <div className="relative z-10 p-8 flex flex-col md:flex-row md:space-x-10 items-center justify-center w-full">
          <div className="w-56 md:w-72 flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border-2 border-white/10">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover aspect-[2/3]" />
          </div>
          
          <div className="flex-1 mt-8 md:mt-0 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{movie.title}</h1>
            
            {(movie.rating > 0 || movie.numReviews > 0) && (
              <div className="flex items-center justify-center md:justify-start text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(movie.rating) ? 'text-yellow-400' : 'text-gray-600'} />
                ))}
                <span className="ml-2 text-gray-300 font-medium">({movie.numReviews} Reviews)</span>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-semibold">
              <span className="bg-white text-black px-3 py-1 rounded">2D, IMAX</span>
              <span className="bg-slate-800 text-white border border-slate-600 px-3 py-1 rounded">{movie.language}</span>
              <span className="text-gray-300 bg-slate-800 border border-slate-600 px-3 py-1 rounded">{movie.duration}m</span>
              <span className="text-gray-300 bg-slate-800 border border-slate-600 px-3 py-1 rounded">{movie.genre}</span>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">{movie.description}</p>
            
            {movie.cast && movie.cast.length > 0 && (
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-slate-400 font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {movie.cast.map((actor, idx) => (
                    <span key={idx} className="bg-slate-800 px-4 py-2 rounded-full text-sm text-gray-200 border border-slate-700">{actor}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shows List */}
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Theaters & Shows</h2>
        {shows.length > 0 ? (
          <div className="space-y-6">
            {shows.map((show) => {
              const showDate = new Date(show.showTime);
              return (
                <div key={show._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white flex items-center"><FaMapMarkerAlt className="mr-2 text-red-500" /> {show.theaterId.name}</h3>
                    <p className="text-sm text-gray-400 ml-6">{show.theaterId.location}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Link to={`/shows/${show._id}/seats`} className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-6 py-2 rounded-lg font-bold text-lg transition-colors">
                        {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Link>
                      <span className="text-xs text-gray-500 mt-1">{show.availableSeats} seats left</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-900 rounded-xl">
             <FaInfoCircle className="text-4xl text-slate-600 mx-auto mb-3" />
             <p className="text-slate-400 text-lg">No shows currently available for this movie.</p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-yellow-500 pl-4">Audience Reviews</h2>
        
        {movie.reviews && movie.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {movie.reviews.map(review => (
              <div key={review._id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/50 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-white block">{review.name}</span>
                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex text-yellow-400 text-sm bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center mb-8">
            <FaStar className="text-5xl text-slate-700 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No reviews yet. Be the first to review this movie!</p>
          </div>
        )}

        {user ? (
          <form onSubmit={submitReview} className="bg-slate-900 p-8 rounded-2xl border border-slate-700/80 mt-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center"><FaStar className="mr-2 text-yellow-500" /> Write a Review</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-gray-400 text-sm font-medium mb-2">Your Rating</label>
                <select value={rating} onChange={e => setRating(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white font-bold focus:border-yellow-500 focus:outline-none transition-colors">
                  <option value="5">5 - Masterpiece!</option>
                  <option value="4">4 - Really Good</option>
                  <option value="3">3 - It was OK</option>
                  <option value="2">2 - Disappointing</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-gray-400 text-sm font-medium mb-2">Share your thoughts</label>
                <textarea required value={comment} onChange={e => setComment(e.target.value)} rows="3" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none transition-colors resize-none" placeholder="What did you think of the cinematography, acting, and plot?"></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={submitLoading} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
                {submitLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">Want to share your thoughts on this movie?</p>
            <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 px-6 py-2 rounded-lg transition-colors">Login to Review</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
