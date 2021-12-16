'use strict';

const core = require('../controllers/core.controller');

module.exports = function(app) {
  // Define application status route
  app.get('/', core.renderStatus);
};
