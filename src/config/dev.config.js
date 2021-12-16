"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
exports.setEnvironmentSpecificConfiguration = function (config) {
    console.log('inside setEnvironmentSpecificConfiguration for dev');
    process.env.APP_SERVER_NAME = 'localhost';
    process.env.APP_SERVER_PORT = 8081;
    process.env.APP_SERVER_HTTPS = false;
    process.env.APP_DB_PATH = 'mongodb://localhost/dev-productsdb';
    config.jwtSecret = 'developmentJwtSecret';
    config.server.endiciaUrl = 'https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx';
    config.server.endiciaPassPhrase = 'password';
    config.server.endiciaDbHost = 'localhost';
    config.server.endiciaDbUser = '22ndtech_test';
    config.server.endiciaDbPassword = '1Bluemonk@';
    config.server.endiciaDbDatabase = '22ndtech_test';
    config.server.stripe_account = 'acct_1AMR7nGGCQVVZE9Z';
    config.logger = {};
    config.logger_options = {
        name: process.env.APP_SERVER_NAME,
        src: true,
        streams: [
            {
                level: 'debug',
                stream: process.stdout // log INFO and above to stdout
            },
            {
                level: 'debug',
                path: './22ndtech-dev-error.log' // log ERROR and above to a file
            }
        ],
        serializers: {
            app: function (app) {
                if (app) {
                    return {
                        appName: app.name,
                        appUrl: app.url
                    };
                }
            },
            req: bunyan.stdSerializers.req,
            res: bunyan.stdSerializers.res
        }
    };
    config.server.stripe_api_key = 'sk_test_vVsO3f7RSTWpPpgSzNUDjlZq';
    process.env.AWS_PROFILE = 'apgv-public-rw-test';
    config.aws = {};
    config.aws.mainSiteBucket = 'apgv-public-read-test';
    config.aws.imagesFolder = config.aws.websiteBucket + '/img';
};
//# sourceMappingURL=dev.config.js.map