'use strict';

const checkoutController = require('../controllers/checkout.controller');

module.exports = function (app) {
    // Define application status route
    app.post('/checkout/charges', checkoutController.createCharge);
    app.post('/checkout/client-auth-token', checkoutController.getClientAuthToken);
    app.post('/checkout/save-stripe-seller', checkoutController.saveStripeSeller);
};