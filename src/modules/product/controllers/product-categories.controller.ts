'use strict';

const aws = require('aws-sdk');

import { AwsS3 } from '../../aws-s3/controllers/aws-s3.lib';
const config = require('../../../config/config');
let logger = config.logger;

var ProductCategoryModel = require('mongoose').model('ProductCategory');
var ProductProductCategoryModel = require('mongoose').model('ProductProductCategory');

export var getProductCategories = function (req, res, next) {
    // logger.info('product-categories.controller.getProductCategories');

    ProductCategoryModel
        .find({}, 'Key DisplayIndex ImageUrl')
        .sort({ DisplayIndex: 1 })
        .exec(function (err, productCategories) {
            if (err) {
                res.writeHead(500);
                return next(err);
            } else {
                // logger.info('product-categories.controller.getProductCategories: products found productCategories = ' + productCategories);
                res.send(200, productCategories);
                return next();
            }
        });

};

export var addProductCategory = function (req, res, next) {
    let newProductCategory = req.body.productCategory;

    ProductCategoryModel.findOne({ 'Key': newProductCategory.Key }).exec(function (err, productCategory) {

        if (err) return next(err);
        if (productCategory) {
            res.writeHead(500);
            res.end('Unable to insert duplicate productCategory ' + req.params.productCategory);
            return next();
        } else {
            try {
                productCategory = new ProductCategoryModel(newProductCategory);
            }
            catch (err) {
                logger.error(err);
                throw err;
            }

            productCategory.save(
                function (err, productCategory, numAffected) {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    } else {
                        res.send(201, productCategory);
                    }
                });
            return next();
        }
    });
};

export var deleteProductCategory = function (req, res, next) {

    ProductCategoryModel.findOne({ Key: req.params.productCategory }).exec(function (err, productCategory) {
        if (err) {
            res.writeHead(500);
            return next(err);
        } else {
            ProductProductCategoryModel.remove({ ProductCategory: productCategory._id },
                (err, productProductCategory) => {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    } else {
                        ProductCategoryModel.remove({ Key: req.params.productCategory },
                            function (err, productCategory) {
                                if (err) {
                                    logger.error(err);
                                    res.writeHead(500);
                                    res.end(err);
                                } else {
                                    res.send(201, {
                                        'message': 'Product Category (' + req.params.productCategory + ') Successfully Removed',
                                        'productCategoryName': req.params.productCategory
                                    });

                                    return next();
                                }
                            });
                    }
                });

        }
    });

};

export var moveTo = function (req, res, next) {
    var key = req.params.productCategory;
    var newDisplayIndex = +req.params.newDisplayIndex;

    ProductCategoryModel
        .findOne({ Key: key })
        .exec((err, doc) => {
            if (err) {
                return next(err);
            }
            var oldDisplayIndex = doc._doc.DisplayIndex;
            if (newDisplayIndex < oldDisplayIndex) { // moving up
                // set the old record displayIndex to -1
                ProductCategoryModel
                    .findByIdAndUpdate(
                    doc._doc._id,
                    { $set: { DisplayIndex: -1 } })
                    .exec((err, doc1) => {
                        if (err) {
                            return next(err);
                        }

                        // increment the display index for every record where the
                        // displayIndex is less than the oldDisplayIndex and greater 
                        // than or equal to the newDisplayIndex
                        ProductCategoryModel.update(
                            {
                                $and: [
                                    { DisplayIndex: { $gte: newDisplayIndex } },
                                    { DisplayIndex: { $lt: oldDisplayIndex } },
                                ]
                            },
                            { $inc: { DisplayIndex: 1 } },
                            { runValidators: true, multi: true },
                            (err, rawResponse) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    ProductCategoryModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                                        .exec(
                                        (err, innerDoc) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                ProductCategoryModel.
                                                    find({})
                                                    .sort({ DisplayIndex: 1 })
                                                    .exec(
                                                    (err, productImages) => {
                                                        if (err) {
                                                            return next(err);
                                                        } else {
                                                            res.json(productImages);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                    });
            }
            else {// moving down
                // set the old record displayIndex to -1
                ProductCategoryModel.findByIdAndUpdate(
                    doc._doc._id,
                    { $set: { DisplayIndex: -1 } })
                    .exec((err, doc3) => {
                        if (err) {
                            return next(err);
                        }


                        // decrement the display index for every record where the
                        // displayIndex is less than or equal to the newDisplayIndex 
                        // and greater than the oldDisplayIndex
                        ProductCategoryModel.update(
                            {
                                $and: [
                                    { DisplayIndex: { $lte: newDisplayIndex } },
                                    { DisplayIndex: { $gt: oldDisplayIndex } },
                                ]
                            },
                            { $inc: { DisplayIndex: -1 } },
                            { runValidators: true, multi: true },
                            (err, rawResponse) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    ProductCategoryModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                                        .exec(
                                        (err, innerDoc) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                ProductCategoryModel.
                                                    find({})
                                                    .sort({ DisplayIndex: 1 })
                                                    .exec(
                                                    (err, productImages) => {
                                                        if (err) {
                                                            return next(err);
                                                        } else {
                                                            res.json(productImages);
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                    });
            }

        });
}

export var getProductCategoryImageSignature = function (req, res, next) {
    try {
        let s3 = new aws.S3();
        let awsS3 = new AwsS3();


        let options = {
            Bucket: config.aws.mainSiteBucket,
            Key: 'img/' + req.query.product_category + "/" + req.query.file_name,
            Expires: 60,
            ContentType: req.query.file_type,
            ACL: 'public-read'
        }

        s3.getSignedUrl('putObject', options, function (err, data) {
            if (err) {
                return res.send('Error with S3');
            } else {
                res.json({
                    signed_request: data,
                    url: 'https://s3.amazonaws.com/' + config.aws.mainSiteBucket + "/" + options.Key
                });
            }
        });
    }
    catch (err) {
        throw err;
    }
};

export var updateProductCategory = function (req, res, next) {
    var updatedProductCategory = req.body;

    ProductCategoryModel.findOneAndUpdate(
        { Key: updatedProductCategory.Key },
        { $set: { ImageUrl: updatedProductCategory.ImageUrl } },
        { new: true },
        function (err, newProductCategory) {
            if (err) {
                return next(err);
            } else {
                res.send(201, newProductCategory);
            }
        }
    );

    // ProductCategoryModel.findById(new Object(updatedProductCategory._id), function (err, productCategory) {

    //     if (err) return next(err);
    //     if (productCategory) {

    //         if (updatedProductCategory.ImageUrl && (updatedProductCategory.ImageUrl !== productCategory._doc.ImageUrl)) {
    //             productCategory.ImageUrl = updatedProductCategory.ImageUrl;
    //         }

    //         if (updatedProductCategory.DisplayIndex && (updatedProductCategory.DisplayIndex !== productCategory._doc.DisplayIndex)) {
    //             productCategory.DisplayIndex = updatedProductCategory.DisplayIndex;
    //         }
    //         try {
    //             productCategory.save(
    //                 function (err, savedProductCategory, numAffected) {
    //                     if (err) {
    //                         return next(err);
    //                     } else {
    //                         res.send(201, savedProductCategory);
    //                     }
    //                 });
    //         }
    //         catch (err) {
    //             logger.error(err);
    //             throw err;
    //         }
    //     } else {
    //         return next(new Error('Unable to find productCategory with Key = ' + updatedProductCategory.Key));
    //     }
    // });

}