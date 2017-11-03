const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  text: String,
  date: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
