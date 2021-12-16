'use strict';
const addressesController = require('../controllers/addresses.controller');
module.exports = function (app) {
    // Define application status route
    app.get('/addresses/', addressesController.getAddresses);
};
//# sourceMappingURL=address.routes.js.map