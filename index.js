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

app.get('/monthly-results', (req, res, next) => {
  let yourDate = new Date();
  let today = yourDate.toISOString().split('T')[0];

  const date = new Date();
  const additionOfMonths = 1;
  date.setMonth(date.getMonth() - additionOfMonths);
  const lastMonth = date.toISOString().split('T')[0];
  Position.find(
    Position.find({
      date: { $gte: lastMonth, $lte: today }
    })
  )
    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/monthly-results', (req, res, next) => {
  let yourDate = new Date();
  let today = yourDate.toISOString().split('T')[0];

  const date = new Date();
  const additionOfMonths = 1;
  date.setMonth(date.getMonth() - additionOfMonths);
  const lastMonth = date.toISOString().split('T')[0];

  Position.find(
    Position.find({
      date: { $gte: lastMonth, $lte: today }
    })
  )
    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/week-results', (req, res, next) => {
  let yourDate = new Date();
  let today = yourDate.toISOString().split('T')[0];

  const weekDate = new Date();
  const additionOfDays = 6;
  weekDate.setDate(weekDate.getDate() - additionOfDays); //
  const lastWeek = weekDate.toISOString().split('T')[0];

  Position.find(
    Position.find({
      date: { $gte: lastWeek, $lte: today }
    })
  )
    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/hourly-results', (req, res, next) => {
  let yourDate = new Date();
  let today = yourDate.toISOString().split('T')[0];
  const date = new Date();
  const additionOfHours = 1;
  date.setHours(date.getHours() - additionOfHours); // For subtract use minus (-)
  const previousHour = date.toISOString().split('T')[1].slice(0, 8);

  var time = new Date();
  var timeNow =
    time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
  console.log(previousHour, timeNow);
  Position.find(
    Position.find({
      date: today,
      time: { $gte: previousHour, $lte: timeNow }
    })
  )
    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/significant', (req, res, next) => {
  Position.find(
    Position.find({
      magnitude: { $gte: 5.0 }
    })
  )
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
