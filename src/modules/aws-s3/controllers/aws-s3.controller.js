'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require('aws-sdk');
const config = require('../../../config/config');
exports.deleteObject = function (req, res, next) {
    try {
        let s3 = new aws.S3();
        let options = {
            Bucket: config.aws.mainSiteBucket,
            Key: 'img/' + req.query.product_id + "/" + req.query.file_name
        };
        s3.deleteObject(options, function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.send(err);
            }
            else {
                res.json(data);
            }
        });
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=aws-s3.controller.js.map