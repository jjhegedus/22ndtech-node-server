"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironmentSpecificConfiguration = function (config) {
    // console.log('inside setEnvironmentSpecificConfiguration');
    process.env.APP_SERVER_NAME = 'ec2-34-207-115-234.compute-1.amazonaws.com';
    process.env.APP_SERVER_PORT = 80;
    process.env.APP_SERVER_HTTPS = false;
    process.env.APP_DB_PATH = 'mongodb://localhost/productsdb';
    config.jwtSecret = 'productionJwtSecret';
    config.server.endiciaUrl = 'https://elstestserver.endicia.com/LabelService/EwsLabelService.asmx';
    config.server.endiciaPassPhrase = 'mypassword';
    config.aws = {};
    config.aws.accessKeyId = 'AKIAJF2O7WGHIRQMTNTA';
    config.aws.secretKey = '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';
    config.aws.mainSiteBucket = 'apgv-public-read';
    config.aws.imagesFolder = config.aws.websiteBucket + '/img';
};
//# sourceMappingURL=prod.config.js.map