'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/myTweet';
//dbURI = 'mongodb://mytweetwebusername:mytweetwebpassword@ds245805.mlab.com:45805/mytweetweb';

// heroku config:set NODE_ENV="production"
// heroku config:set MONGOLAB_URI=mongodb://mytweetwebusername:mytweetwebpassword@ds245805.mlab.com:45805/mytweetweb
// username: mytweetwebusername
// password: mytweetwebpassword
// address: ds245805.mlab.com
// port:45805
// database: my-tweet-web




if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV !== 'production') {
    let seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Tweet = require('./tweet');
    const User = require('./user');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');

      //console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
