'use strict';

const Handlebars = require('handlebars');
const User =  require('../models/user');

Handlebars.registerHelper('shortDate', function (date) {
  date = date - date.getTimezoneOffset();
});

module.exports = Handlebars;

