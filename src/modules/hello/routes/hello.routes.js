'use strict';

const hello = require('../controllers/hello.controller');

module.exports = function(app) {
  // Define application status route
  app.get('/hello/:name', hello.renderHello);
};
