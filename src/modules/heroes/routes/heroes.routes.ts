'use strict';

const heroesController = require('../controllers/heroes.controller');

module.exports = function (app) {
    // Define application status route
    app.get('/heroes', heroesController.getHeroes);
};