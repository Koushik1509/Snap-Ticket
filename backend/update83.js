const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to DB');
  let movie = await Movie.findOne({ title: '83' });
  if (movie) {
    movie.posterUrl = '/images/83.png';
    await movie.save();
    console.log('Updated existing 83 movie poster');
  } else {
    movie = await Movie.create({
      title: '83',
      description: 'The story of India\'s incredible 1983 Cricket World Cup victory.',
      duration: 162,
      genre: 'Drama/Sports',
      language: 'Hindi',
      posterUrl: '/images/83.png',
      cast: ['Ranveer Singh', 'Deepika Padukone', 'Pankaj Tripathi']
    });
    console.log('Created new 83 movie record');
  }
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
