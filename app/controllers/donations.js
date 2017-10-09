'use strict';

const Donation = require('../models/donation');
const User = require('../models/user');

exports.home = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    User.findOne({ id: userId }).then(foundUser => {
      reply.view('home', {
        title: 'Make a Donation',
        user: foundUser,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.report = {
  handler: function (request, reply) {
    let user = request.auth.credentials.loggedInUser;
    User.findOne({ id: user }).then(foundUser => {
      user = foundUser;
    });
    Donation.find({}).populate('donor').then(allDonations => {
      reply.view('report', {
        title: 'Donations to Date',
        donations: allDonations,
        user: user,
      });
    }).catch(err => {
      reply.redirect('./home');
    });
  },
};

exports.donate = {
  handler: function (request, reply) {
    const donorId = request.auth.credentials.loggedInUser;
    User.findOne({ id: donorId }).then(user => {
      const data = request.payload;
      const donation = new Donation(data);
      donation.donor = user._id;
      donation.save().then(newDonation => {
        reply.redirect('./report');
      }).catch(err => {
        reply.redirect('/home');
      });
    });
  },
};
