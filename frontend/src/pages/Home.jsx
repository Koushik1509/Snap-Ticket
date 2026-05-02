import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaPlay, FaClock, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import PublicLanding from '../components/PublicLanding';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies', error);
      }
      setLoading(false);
    };
    fetchMovies();
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (loading) return <div className="text-center mt-20 text-2xl font-bold animate-pulse text-gray-400">Loading blockbusters...</div>;

  // Extract unique genres and languages for filters
  const genres = ['All', ...new Set(movies.map(m => m.genre))];
  const languages = ['All', ...new Set(movies.map(m => m.language))];

  // Apply filters
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'All' || movie.genre === genreFilter;
    const matchesLanguage = languageFilter === 'All' || movie.language === languageFilter;
    return matchesSearch && matchesGenre && matchesLanguage;
  });

  if (!user) {
    return <PublicLanding movies={movies} />;
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Dynamic Hero Carousel Area */}
      {movies.length > 0 && (
        <section className="relative w-full h-[50vh] sm:h-[60vh] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900 shadow-2xl group">
          {movies.slice(0, 5).map((movie, index) => (
            <div 
              key={movie._id} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'} flex items-center`}
            >
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Cinema Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-20" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40"></div>
              
              <div className="relative z-20 h-full w-full flex flex-col md:flex-row items-center justify-between p-8 sm:p-16 max-w-6xl mx-auto gap-8">
                
                {/* Movie Info */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-2 shadow-lg shadow-red-900/50">
                    {movie.language} • {movie.genre}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
                    {movie.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 font-light max-w-xl drop-shadow-md line-clamp-3">
                    {movie.description || "Experience the magic of cinema. Book your tickets now for the best seats."}
                  </p>
                  <div className="pt-6">
                    <Link to={`/movies/${movie._id}`} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all">
                      <FaPlay className="text-sm" /> Book Tickets
                    </Link>
                  </div>
                </div>

                {/* Movie Poster (Unstretched) */}
                <div className="hidden md:block flex-shrink-0">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-4 border-slate-800/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-56 lg:w-72 aspect-[2/3] object-cover"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            {movies.slice(0, 5).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentHeroIndex ? 'w-8 bg-red-500' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto">
        <div className="glass-panel p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search movies by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <select 
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
            >
              {genres.map(genre => <option key={genre} value={genre}>{genre} Genre</option>)}
            </select>
            <select 
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
            >
              {languages.map(lang => <option key={lang} value={lang}>{lang} Lang</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white border-l-4 border-red-500 pl-4">{searchTerm || genreFilter !== 'All' ? 'Search Results' : 'Recommended Movies'}</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
            <Link to={`/movies/${movie._id}`} key={movie._id} className="group">
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {movie.language}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
                <p className="text-gray-400 text-sm mt-1 truncate">{movie.genre}</p>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-10 text-center text-gray-500 text-xl font-medium">No movies currently available.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
