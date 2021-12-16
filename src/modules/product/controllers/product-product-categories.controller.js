'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
let logger = config.logger;
var ProductProductCategoryModel = require('mongoose').model('ProductProductCategory');
var ProductCategoryModel = require('mongoose').model('ProductCategory');
var ProductModel = require('mongoose').model('Product');
exports.getProductProductCategories = function (req, res, next) {
    if (req.params.productId) {
        ProductModel.findById(req.params.productId).exec(function (err, product) {
            if (err)
                return next(err);
            if (!product)
                return next(new Error('Failed to load product ' + req.params.productId));
            ProductProductCategoryModel
                .find({ Product: product }, 'Product ProductCategory')
                .populate('ProductCategory Product')
                .exec(function (err, productProductCategories) {
                if (err) {
                    res.writeHead(500);
                    return next(err);
                }
                else {
                    res.send(200, productProductCategories);
                    return next();
                }
            });
        });
    }
    else {
        ProductProductCategoryModel
            .find({}, 'Product ProductCategory')
            .populate('ProductCategory Product')
            .exec(function (err, productProductCategories) {
            if (err) {
                res.writeHead(500);
                return next(err);
            }
            else {
                res.send(200, productProductCategories);
                return next();
            }
        });
    }
};
exports.addProductProductCategory = function (req, res, next) {
    ProductModel.findById(req.params.productId).exec(function (err, product) {
        if (err)
            return next(err);
        if (!product)
            return next(new Error('Failed to load product ' + req.params.productId));
        ProductCategoryModel.findOne({ Key: req.params.productCategory }).exec(function (err, productCategory) {
            if (err) {
                res.writeHead(500);
                return next(err);
            }
            else {
                var productProductCategory;
                try {
                    productProductCategory = new ProductProductCategoryModel({
                        Product: product,
                        ProductCategory: productCategory
                    });
                }
                catch (err) {
                    logger.error(err);
                    throw err;
                }
                productProductCategory.save(function (err, productProductCategory, numAffected) {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    }
                    else {
                        res.send(201, productProductCategory);
                    }
                });
                return next();
            }
        });
    });
};
exports.deleteProductProductCategory = function (req, res, next) {
    ProductModel.findById(req.params.productId).exec(function (err, product) {
        if (err)
            return next(err);
        if (!product)
            return next(new Error('Failed to load product ' + req.params.productId));
        ProductCategoryModel.findOne({ Key: req.params.productCategory }).exec(function (err, productCategory) {
            if (err) {
                res.writeHead(500);
                return next(err);
            }
            else {
                var productProductCategory;
                ProductProductCategoryModel.remove({ Product: product, ProductCategory: productCategory }, (err, productProductCategory) => {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    }
                    else {
                        res.send(201, { 'message': 'Product Product Category (' + product.name + ', ' + productCategory.Key + ') Successfully Removed' });
                    }
                });
            }
        });
    });
};
//# sourceMappingURL=product-product-categories.controller.js.map