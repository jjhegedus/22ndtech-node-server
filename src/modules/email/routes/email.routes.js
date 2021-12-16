'use strict';
let userController = require('../../users/controllers/users.controller');
let emailController = require('../controllers/email.controller');
module.exports = function (app) {
    // Define application status route
    app.post('/api/email', userController.decodeToken, emailController.send);
};
//# sourceMappingURL=email.routes.js.map