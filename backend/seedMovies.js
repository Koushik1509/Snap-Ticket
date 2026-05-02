const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

dotenv.config();

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB. Seeding sample movies data...');

    // Clear old sample data to avoid duplicates
    await Movie.deleteMany();
    await Theater.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();

    // 1. Create South Indian Movies with Posters and Cast
    const movies = await Movie.insertMany([
      { 
        title: 'Kalki 2898 AD', 
        description: 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.', 
        duration: 180, 
        genre: 'Sci-Fi/Action', 
        language: 'Telugu',
        posterUrl: '/images/kalki.png',
        cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone']
      },
      { 
        title: 'RRR', 
        description: 'A fictitious story about two legendary Indian revolutionaries and their journey away from home before they started fighting for their country in the 1920s.', 
        duration: 187, 
        genre: 'Action/Epic', 
        language: 'Telugu',
        posterUrl: '/images/rrr.png',
        cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn']
      },
      { 
        title: 'KGF: Chapter 2', 
        description: 'In the blood-soaked Kolar Gold Fields, Rocky\'s name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.', 
        duration: 168, 
        genre: 'Action/Thriller', 
        language: 'Kannada',
        posterUrl: '/images/kgf.png',
        cast: ['Yash', 'Sanjay Dutt', 'Srinidhi Shetty', 'Raveena Tandon']
      },
      { 
        title: 'Pushpa: The Rise', 
        description: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate, making some powerful enemies in the process.', 
        duration: 175, 
        genre: 'Action/Crime', 
        language: 'Telugu',
        posterUrl: '/images/pushpa.png',
        cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna']
      },
      {
        title: 'Leo',
        description: 'A mild-mannered cafe owner becomes a local hero through an act of violence, which sets off repercussions with connections to an old life he left behind.',
        duration: 164,
        genre: 'Action/Thriller',
        language: 'Tamil',
        posterUrl: '/images/leo.png',
        cast: ['Vijay', 'Sanjay Dutt', 'Trisha Krishnan', 'Arjun Sarja']
      }
    ]);

    // 2. Create Theaters
    const theaters = await Theater.insertMany([
      { name: 'Prasads IMAX', location: 'Hyderabad, Telangana' },
      { name: 'AMB Cinemas', location: 'Gachibowli, Hyderabad' },
      { name: 'PVR Nexus Mall', location: 'Koramangala, Bengaluru' }
    ]);

    // 3. Setup Show Times (Today and Tomorrow)
    const today = new Date();
    const tonight = new Date(today.setHours(20, 0, 0, 0)); // 8 PM today
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowAfternoon = new Date(tomorrow.setHours(14, 30, 0, 0)); // 2:30 PM tomorrow

    await Show.insertMany([
      { movieId: movies[0]._id, theaterId: theaters[0]._id, showTime: tonight, availableSeats: 60 },
      { movieId: movies[0]._id, theaterId: theaters[1]._id, showTime: tomorrowAfternoon, availableSeats: 60 },
      { movieId: movies[1]._id, theaterId: theaters[2]._id, showTime: tonight, availableSeats: 60 }, 
      { movieId: movies[1]._id, theaterId: theaters[0]._id, showTime: tomorrowAfternoon, availableSeats: 60 },
      { movieId: movies[2]._id, theaterId: theaters[1]._id, showTime: tonight, availableSeats: 60 }, 
      { movieId: movies[3]._id, theaterId: theaters[2]._id, showTime: tomorrowAfternoon, availableSeats: 60 },
      { movieId: movies[4]._id, theaterId: theaters[0]._id, showTime: tonight, availableSeats: 60 }
    ]);

    console.log('✅ Loaded major blockbuster South Indian movies, theaters, and shows!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMovies();
