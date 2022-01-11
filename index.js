const PORT = process.env.PORT || 8000;

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const Position = require('./Models/position.js');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res, next) => {
  Position.find(Position.find())
    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
