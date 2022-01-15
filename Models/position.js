'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.ObjectId },
    date: {
      type: String,
      trim: true,
      required: true
    },
    time: {
      type: String
    },
    longitude: {
      type: String
    },
    latitude: {
      type: String
    },
    depth: {
      type: String
    },
    magnitude: {
      type: String
    },
    direction: {
      type: String
    },
    location: {
      type: String
    },
    __v: { type: Number }
  },
  {
    timestamps: {
      createdAt: 'creationDate'
    }
  }
);
const Position = mongoose.model('Position', schema);

module.exports = Position;
