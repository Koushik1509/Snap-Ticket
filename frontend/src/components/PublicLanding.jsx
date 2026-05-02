import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaPlayCircle } from 'react-icons/fa';

const PublicLanding = ({ movies }) => {
  // Duplicate movies to create a seamless infinite scrolling effect
  const marqueeMovies1 = [...movies, ...movies];
  // Reverse the second row for variation
  const marqueeMovies2 = [...movies].reverse();
  const marqueeMovies2Dup = [...marqueeMovies2, ...marqueeMovies2];

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden w-[100vw] left-1/2 -translate-x-1/2 rounded-3xl -mt-8 py-20 bg-slate-950">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-950 z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900/0 to-transparent z-10 pointer-events-none"></div>

      {/* Dynamic Marquee Background */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-6 opacity-40 rotate-[-4deg] scale-110 pointer-events-none">
        
        {/* Row 1 - Moving Right to Left */}
        <div className="flex gap-6 animate-marquee">
          {marqueeMovies1.map((movie, index) => (
            <div key={`row1-${index}`} className="w-48 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Row 2 - Moving Left to Right */}
        <div className="flex gap-6 animate-marquee-reverse">
          {marqueeMovies2Dup.map((movie, index) => (
            <div key={`row2-${index}`} className="w-48 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 text-center space-y-8 max-w-4xl px-4 mt-12 backdrop-blur-sm bg-slate-900/30 p-12 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
          Experience <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            Cinematic Magic
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto drop-shadow-md">
          Discover the latest blockbusters, browse available shows, and secure your favorite seats instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link to="/login" className="btn-primary flex items-center gap-2 text-lg px-8 py-4 shadow-lg shadow-red-500/30 w-full sm:w-auto justify-center">
            <FaTicketAlt /> Sign In to Book
          </Link>
          <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg backdrop-blur-md transition-all duration-300 flex items-center gap-2 text-lg w-full sm:w-auto justify-center border border-white/20 hover:border-white/40">
            <FaPlayCircle /> Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
