const endicia = require('../controllers/endicia.controller');

module.exports = function (app) {
    // Define application status route
    app.post('/endicia/:accountId/passPhrase', endicia.changePassPhrase);
    app.post('/endicia/:accountId/recreditRequest', endicia.recreditRequest);
    app.get('/endicia/shipments', endicia.getShipments);
};
