const PORT = 8000;
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const Position = require('./Models/position.js');
const cron = require('node-cron');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const job = cron.schedule('* * * * * *', function jobYouNeedToExecute() {
  // Do whatever you want in here. Send email, Make  database backup or download data.
  console.log('hi');
  const url = 'https://www.emsc-csem.org/Earthquake/?view=230';
  try {
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      let all = [];

      $('#tbody > tr ').each(function (i, e) {
        var scrapedLongitude = $($(e).find('td')[6]).text();
        var scrapedLongDirection = $($(e).find('td')[7]).text().trim();
        var scrapedLatitude = $($(e).find('td')[4]).text();
        var scrapedLatDirection = $($(e).find('td')[5]).text().trim();
        var scrapedLocation = $($(e).find('.tb_region')).text().trim();
        var scrapedDepth = $($(e).find('td')[8]).text().concat('KM');
        //let d = $($(e).find('td > i')).text();
        let scrapedDateAndTime = $($(e).find('td > b > a')).text();
        let scrapedDate = scrapedDateAndTime.substring(0, 10);
        let scrapedTime = scrapedDateAndTime.substring(13, 21);
        let scrapedMagnitude = $($(e).find('td')[10]).text();
        let scrapedFullLong = scrapedLongitude + scrapedLongDirection;
        let scrapedFullLat = scrapedLatitude + scrapedLatDirection;

        all.push(
          scrapedMagnitude,
          scrapedFullLong,
          scrapedDepth,
          scrapedDate,
          scrapedTime,
          scrapedFullLat,
          scrapedLocation
        );

        const test = async (
          scrapedMagnitude,
          scrapedDepth,
          scrapedDate,
          scrapedTime,
          scrapedFullLat,
          scrapedFullLong,
          scrapedLocation
        ) => {
          const isDuplicate = await Position.findOne({
            date: scrapedDate,
            time: scrapedTime,
            longitude: scrapedFullLong,
            latitudes: scrapedFullLat,
            depth: scrapedDepth,
            magnitude: scrapedMagnitude,
            location: scrapedLocation
          });
          if (!isDuplicate) {
            return Position.create({
              date: scrapedDate,
              time: scrapedTime,
              longitude: scrapedFullLong,
              latitude: scrapedFullLat,
              depth: scrapedDepth,
              magnitude: scrapedMagnitude,
              location: scrapedLocation
            });
          } else {
            console.log(isDuplicate);
          }
        };
        test(
          scrapedMagnitude,
          scrapedDepth,
          scrapedDate,
          scrapedTime,
          scrapedFullLat,
          scrapedFullLong,
          scrapedLocation
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/', (req, res, next) => {
  Position.find({ date: '2022-09-01' })
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
