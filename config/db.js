const mongoose = require('mongoose');

const MONGO_SERVER_URI =
  'mongodb+srv://tahmidfaiaz1:test123@cluster0.cmyldaz.mongodb.net/';

const connectionString = MONGO_SERVER_URI;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
