'use strict';

const mongoose = require('mongoose');
const Tweet = require('./tweet');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: Boolean,
  tweets: [
    {
      text: String,
      date: Date,
    },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
