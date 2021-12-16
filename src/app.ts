'use strict';
// console.log('begin program');
var isWin = /^win/.test(process.platform);

if (!isWin) {
    console.log('process.env.APPLICATION_WORKING_DIR = ' + process.env.APPLICATION_WORKING_DIR);
    const sleep = require('sleep');
    process.chdir(process.env.APPLICATION_WORKING_DIR);
    sleep.sleep(1);
}

var config = require('./config/config');
const mongoose = require('./config/lib/mongoose');
mongoose.loadModels();
var passport = require('./config/lib/passport');
passport.init();
const logger = config.logger;
const restify = require('./config/lib/restify');

const oidcProvider = require('oidc-provider');
const oidc = new oidcProvider(config.baseUrl);

var app;

process.on('unhandledRejection', (reason, promise) => {
    console.log('*********************');
    console.log('unhandledRejection: reason = ' + reason + ' promise = ');
    console.log(promise);
    console.log('*********************');
});

mongoose.connect(function () {
    app = restify.init();
    oidc.initialize()
    .then(function(){
        // oidc.callback = (req, res) => {
        //     console.log('req = ');
        //     console.log(req);
        //     console.log('/nres = ');
        //     console.log(res);
        // };
        app.get('/', oidc.callback);
        app.put('/', oidc.callback);
        app.post('/', oidc.callback);
        app.del('/', oidc.callback);
        app.listen(config.server.port, function () {
            // logger.info({ app: app }, '%s listening at %s', app.name, app.url);
        });
    });

});

