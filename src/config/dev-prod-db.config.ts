const bunyan = require('bunyan');

export var setEnvironmentSpecificConfiguration = function (config) {
    console.log('inside setEnvironmentSpecificConfiguration for dev-prod-db');
    process.env.APP_SERVER_NAME = 'localhost';
    process.env.APP_SERVER_PORT = 8081;
    process.env.APP_SERVER_HTTPS = false;
    process.env.APP_DB_PATH = 'mongodb://ec2-34-207-115-234.compute-1.amazonaws.com/productsdb';

    config.jwtSecret = 'productionJwtSecret';

    config.server.endiciaUrl = 'https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx';
    config.server.endiciaPassPhrase = 'password';

    config.server.endiciaDbHost = 'ec2-34-207-115-234.compute-1.amazonaws.com';
    config.server.endiciaDbUser = '22ndtech';
    config.server.endiciaDbPassword = 'password';
    config.server.endiciaDbDatabase = '22ndtech';

    config.server.stripe_account = 'acct_1AMR7nGGCQVVZE9Z';
    config.server.stripe_api_key = 'sk_test_vVsO3f7RSTWpPpgSzNUDjlZq';

    config.aws = {};

    config.logger_options = {
        name: process.env.APP_SERVER_NAME,
        src: true,
        streams: [
            {
                stream: process.stdout            // log INFO and above to stdout
            },
            {
                path: './dev-prod-db-error.log'  // log ERROR and above to a file
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

    // config.aws.accessKeyId = 'AKIAJF2O7WGHIRQMTNTA';
    // config.aws.secretKey = '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';
    config.aws.mainSiteBucket = 'apgv-public-read';
    config.aws.imagesFolder = config.aws.websiteBucket + '/img';
}