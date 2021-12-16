'use strict';

const config = require('../../../config/config');
let logger = config.logger;

var ProductAttributeModel = require('mongoose').model('ProductAttribute');

export var getProductAttributes = function (req, res, next) {
    // logger.debug('product-attributes.controller.getProductAttributes');

    ProductAttributeModel
        .find({}, 'Key DisplayIndex')
        .sort({ DisplayIndex: 1 })
        .exec(function (err, productAttributes) {
            if (err) {
                res.writeHead(500);
                return next(err);
            } else {
                // logger.debug('product-attributes.controller.getProductAttributes: products found productAttributes = ' + productAttributes);
                res.send(200, productAttributes);
                return next();
            }
        });

};

export var addProductAttribute = function (req, res, next) {
    let newProductAttribute = req.body.productAttribute;
    newProductAttribute.NextValueDisplayIndex = 1;

    ProductAttributeModel.findOne({ 'Key': newProductAttribute.Key }).exec(function (err, productAttribute) {

        if (err) return next(err);
        if (productAttribute) {
            res.writeHead(500);
            res.end('Unable to insert duplicate productAttribute ' + req.params.productAttribute);
            return next();
        } else {
            try {
                productAttribute = new ProductAttributeModel(newProductAttribute);
            }
            catch (err) {
                logger.error(err);
                throw err;
            }

            productAttribute.save(
                function (err, productAttribute, numAffected) {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    } else {
                        res.send(201, productAttribute);
                    }
                });
            return next();
        }
    });
};

export var deleteProductAttribute = function (req, res, next) {

    ProductAttributeModel.remove({ Key: req.params.productAttribute },
        function (err, productAttribute) {
            if (err) {
                logger.error(err);
                res.writeHead(500);
                res.end(err);
            } else {
                res.send(201, {
                    'message': 'Product Attribute (' + req.params.productAttribute + ') Successfully Removed',
                    'productAttributeName': req.params.productAttribute
                });
            }
        });

};

export var setDisplayIndex = function (req, res, next) {
    var key = req.params.productAttribute;
    var newDisplayIndex = +req.params.newDisplayIndex;

    ProductAttributeModel
        .findOne({ Key: key })
        .exec((err, doc) => {
            if (err) {
                return next(err);
            }
            var oldDisplayIndex = doc._doc.DisplayIndex;
            if (newDisplayIndex < oldDisplayIndex) { // moving up
                // set the old record displayIndex to -1
                ProductAttributeModel
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
                        ProductAttributeModel.update(
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
                                    ProductAttributeModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                                        .exec(
                                        (err, innerDoc) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                ProductAttributeModel.
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
                ProductAttributeModel.findByIdAndUpdate(
                    doc._doc._id,
                    { $set: { DisplayIndex: -1 } })
                    .exec((err, doc3) => {
                        if (err) {
                            return next(err);
                        }


                        // decrement the display index for every record where the
                        // displayIndex is less than or equal to the newDisplayIndex 
                        // and greater than the oldDisplayIndex
                        ProductAttributeModel.update(
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
                                    ProductAttributeModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                                        .exec(
                                        (err, innerDoc) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                ProductAttributeModel.
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


