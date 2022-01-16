const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const Position = require('./Models/position.js');
let yourDate = new Date();
let today = yourDate.toISOString().split('T')[0];

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res, next) => {
  const date = new Date();
  const addOneMonth = 1;
  date.setMonth(date.getMonth() - addOneMonth);
  const lastMonth = date.toISOString().split('T')[0];

  Position.find(
    {
      date: { $gte: lastMonth, $lte: today }
    },
    { _id: 0 }
  )

    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/three-months', (req, res, next) => {
  const date = new Date();
  const addThreeMonths = 3;
  date.setMonth(date.getMonth() - addThreeMonths);
  const lastThreeMonth = date.toISOString().split('T')[0];

  Position.find(
    {
      date: { $gte: lastThreeMonth, $lte: today }
    },
    { _id: 0 }
  )

    .then((positions) => {
      console.log(positions);
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});
app.get('/week', (req, res, next) => {
  const weekDate = new Date();
  const additionOfDays = 6;
  weekDate.setDate(weekDate.getDate() - additionOfDays); //
  const lastWeek = weekDate.toISOString().split('T')[0];

  Position.find(
    {
      date: { $gte: lastWeek, $lte: today }
    },
    { _id: 0 }
  )

    .then((positions) => {
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/hour', (req, res, next) => {
  const date = new Date();
  const additionOfHours = 1;
  date.setHours(date.getHours() - additionOfHours); // For subtract use minus (-)
  const previousHour = date.toISOString().split('T')[1].slice(0, 8);

  var time = new Date();
  var timeNow =
    time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
  console.log(previousHour, timeNow);

  Position.find(
    {
      date: today,
      time: { $gte: previousHour, $lte: timeNow }
    },
    { _id: 0 }
  )

    .then((positions) => {
      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/significant', (req, res, next) => {
  const date = new Date();
  const addThreeMonths = 3;
  date.setMonth(date.getMonth() - addThreeMonths);
  const lastThreeMonth = date.toISOString().split('T')[0];
  Position.find(
    {
      date: { $gte: lastThreeMonth, $lte: today },
      magnitude: { $gte: 5.0 }
    },
    { _id: 0 }
  )

    .then((positions) => {
      delete positions._id;

      res.json(positions);
    })
    .catch((error) => {
      next(error);
    });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
