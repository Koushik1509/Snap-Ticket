import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DynamicMovieBackground = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies for background", error);
      }
    };
    fetchMovies();
  }, []);

  if (movies.length === 0) return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900"></div>
  );

  // Duplicate arrays to ensure seamless infinite scrolling
  const marqueeMovies1 = [...movies, ...movies, ...movies];
  const marqueeMovies2 = [...movies].reverse();
  const marqueeMovies2Dup = [...marqueeMovies2, ...marqueeMovies2, ...marqueeMovies2];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900 z-10"></div>
      
      {/* Animated Marquee Rows */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-6 opacity-30 rotate-[-6deg] scale-125">
        <div className="flex gap-6 animate-marquee">
          {marqueeMovies1.map((movie, index) => (
            <div key={`bg1-${index}`} className="w-32 md:w-40 lg:w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/5">
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-6 animate-marquee-reverse">
          {marqueeMovies2Dup.map((movie, index) => (
            <div key={`bg2-${index}`} className="w-32 md:w-40 lg:w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/5">
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dark overlay to ensure forms are readable */}
      <div className="absolute inset-0 bg-slate-900/60 z-10 backdrop-blur-[2px]"></div>
    </div>
  );
};

export default DynamicMovieBackground;
