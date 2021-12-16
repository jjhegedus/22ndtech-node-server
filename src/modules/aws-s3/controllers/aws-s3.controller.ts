'use strict';
const aws = require('aws-sdk');
const config = require('../../../config/config');

export var deleteObject = function (req, res, next) {

    try {

        let s3 = new aws.S3();

        let options = {
            Bucket: config.aws.mainSiteBucket,
            Key: 'img/' + req.query.product_id + "/" + req.query.file_name
        }

        s3.deleteObject(options, function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.send(err);
            } else {
                res.json(data);
            }
        });
    }
    catch (err) {
        throw err;
    }
}