'use strict';

const salesTaxController = require('../controllers/sales-tax.controller');

module.exports = function (app) {
    // Define application status route
    app.get('/sales-tax', salesTaxController.getTaxRates);
};