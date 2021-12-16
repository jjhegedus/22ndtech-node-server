'use strict';
const statesController = require('../controllers/states.controller');
module.exports = function (app) {
    // Define application status route
    app.get('/states', statesController.getStates);
};
//# sourceMappingURL=states.routes.js.map