'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
let logger = config.logger;
var ProductAttributeValueModel = require('mongoose').model('ProductAttributeValue');
var ProductAttributeModel = require('mongoose').model('ProductAttribute');
exports.getProductAttributeValues = function (req, res, next) {
    logger.debug('product-attribute-values.controller.getProductAttributeValues');
    if (req.params.productAttributeId) {
        ProductAttributeModel.findById(req.params.productAttributeId).exec(function (err, productAttribute) {
            if (err)
                return next(err);
            if (!productAttribute)
                return next(new Error('Failed to load productAttribute ' + req.params.productAttributeId));
            logger.debug({ message: 'product-attribute-values.controller.getProductAttributeValues: found productAttribute', productAttribute: productAttribute });
            ProductAttributeValueModel
                .find({ ProductAttribute: productAttribute }, 'ProductAttribute, Key, DisplayIndex')
                .populate('ProductAttribute')
                .exec(function (err, productAttributeValues) {
                if (err) {
                    res.writeHead(500);
                    return next(err);
                }
                else {
                    logger.error({ function: 'product-attribute-values.controller.getProductAttributeValues', productAttributeId: req.params.productAttributeId, productAttributeValues: productAttributeValues });
                    res.send(200, productAttributeValues);
                    return next();
                }
            });
        });
    }
    else {
        ProductAttributeValueModel
            .find({}, 'ProductAttribute, Key, DisplayIndex')
            .populate('ProductAttribute')
            .exec(function (err, productAttributeValues) {
            if (err) {
                res.writeHead(500);
                return next(err);
            }
            else {
                logger.error({ function: 'product-attribute-values.controller.getProductAttributeValues', productAttributeValues: productAttributeValues });
                res.send(200, productAttributeValues);
                return next();
            }
        });
    }
};
exports.addProductAttributeValue = function (req, res, next) {
    ProductAttributeModel.findById(req.params.productAttributeId).exec(function (err, productAttribute) {
        if (err)
            return next(err);
        if (!productAttribute)
            return next(new Error('Failed to load productAttribute ' + req.params.productAttributeId));
        ProductAttributeValueModel.findOne({ ProductAttribute: productAttribute, Key: req.body.productAttributeValue }).exec(function (err, productAttributeValue) {
            if (err) {
                res.writeHead(500);
                return next(err);
            }
            else if (productAttributeValue) {
                return next(new Error('Cannot create duplicate productAttributeValue with productAttributeId = ' + req.params.productAttributeId + ' and productAttributeValue = ' + req.body.productAttributeValue));
            }
            else {
                var productAttributeValue;
                try {
                    productAttributeValue = new ProductAttributeValueModel({
                        ProductAttribute: productAttributeValue,
                        Key: req.body.productAttributeValue
                    });
                }
                catch (err) {
                    logger.error(err);
                    return next(err);
                }
                productAttributeValue.save(function (err, productAttributeValue, numAffected) {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    }
                    else {
                        res.send(201, productAttributeValue);
                    }
                });
                return next();
            }
        });
    });
};
exports.deleteProductAttributeValue = function (req, res, next) {
    if (exports.productAttributeValueHasBeenUsed(req.params.productAttributeValueId)) {
        return next(new Error('product-attribute-values.controller.ts: deleteProductAttributeValue(' + req.params.productAttributeValueId + '): Cannot delete the productAttributeValue after it has been used.  It must remain available for reporting purposes related to old data.'));
    }
    else {
        ProductAttributeValueModel.findByIdAndRemove(new Object(req.params.id), function (err, product) {
            if (err) {
                res.status(500);
                res.json({
                    type: false,
                    data: 'Error occured in deleteProductAttributeValue (' + req.params.id + '): ' + err
                });
            }
            else {
                res.status(201);
                res.json({
                    "message": 'ProductAttribueValue id: ' + req.params.id + ' deleted successfully'
                });
            }
        });
        return next();
    }
};
exports.productAttributeValueHasBeenUsed = function (productAttributeValueId) {
    return true;
};
exports.setDisplayIndex = function (req, res, next) {
    var key = req.params.productAttributeValueId;
    var newDisplayIndex = +req.params.newDisplayIndex;
    ProductAttributeModel
        .findOne({ Key: key })
        .exec((err, doc) => {
        if (err) {
            return next(err);
        }
        var oldDisplayIndex = doc._doc.DisplayIndex;
        if (newDisplayIndex < oldDisplayIndex) {
            // set the old record displayIndex to -1
            ProductAttributeModel
                .findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: -1 } })
                .exec((err, doc1) => {
                if (err) {
                    return next(err);
                }
                // increment the display index for every record where the
                // displayIndex is less than the oldDisplayIndex and greater 
                // than or equal to the newDisplayIndex
                ProductAttributeModel.update({
                    $and: [
                        { DisplayIndex: { $gte: newDisplayIndex } },
                        { DisplayIndex: { $lt: oldDisplayIndex } },
                    ]
                }, { $inc: { DisplayIndex: 1 } }, { runValidators: true, multi: true }, (err, rawResponse) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        ProductAttributeModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                            .exec((err, innerDoc) => {
                            if (err) {
                                return next(err);
                            }
                            else {
                                ProductAttributeModel.
                                    find({})
                                    .sort({ DisplayIndex: 1 })
                                    .exec((err, productImages) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    else {
                                        res.json(productImages);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
        else {
            // set the old record displayIndex to -1
            ProductAttributeModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: -1 } })
                .exec((err, doc3) => {
                if (err) {
                    return next(err);
                }
                // decrement the display index for every record where the
                // displayIndex is less than or equal to the newDisplayIndex 
                // and greater than the oldDisplayIndex
                ProductAttributeModel.update({
                    $and: [
                        { DisplayIndex: { $lte: newDisplayIndex } },
                        { DisplayIndex: { $gt: oldDisplayIndex } },
                    ]
                }, { $inc: { DisplayIndex: -1 } }, { runValidators: true, multi: true }, (err, rawResponse) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        ProductAttributeModel.findByIdAndUpdate(doc._doc._id, { $set: { DisplayIndex: newDisplayIndex } })
                            .exec((err, innerDoc) => {
                            if (err) {
                                return next(err);
                            }
                            else {
                                ProductAttributeModel.
                                    find({})
                                    .sort({ DisplayIndex: 1 })
                                    .exec((err, productImages) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    else {
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
};
//# sourceMappingURL=product-attribute-values.controller.js.map