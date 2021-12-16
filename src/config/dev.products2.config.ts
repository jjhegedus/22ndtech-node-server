export var setEnvironmentSpecificConfiguration = function (config) {
    // console.log('inside setEnvironmentSpecificConfiguration');
    process.env.APP_SERVER_NAME = 'localhost';
    process.env.APP_SERVER_PORT = 8081;
    process.env.APP_SERVER_HTTPS = false;
    process.env.APP_DB_PATH = 'mongodb://localhost/products2';

    config.jwtSecret = 'developmentJwtSecret';

    config.server.endiciaUrl = 'https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx';
    config.server.endiciaPassPhrase = 'mypassword';

    process.env.AWS_PROFILE = 'apgv-public-rw-test';

    config.aws = {};

    config.aws.mainSiteBucket = 'apgv-public-read-test';
    config.aws.imagesFolder = config.aws.websiteBucket + '/img';
}