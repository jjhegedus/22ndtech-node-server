'use strict';
const config = require('../../../config/config');

var ProductProductCategoryModel = require('mongoose').model('ProductProductCategory');
var ProductCategoryModel = require('mongoose').model('ProductCategory');
var ProductModel = require('mongoose').model('Product');

export var getProductProductCategories = function (req, res, next) {
    console.log('product-product-categories.controller.getProductProductCategories');

    if (req.params.productId) {


        ProductModel.findById(req.params.productId).exec(function (err, product) {
            if (err)
                return next(err);
            if (!product)
                return next(new Error('Failed to load product ' + req.params.productId));
            console.log('product-product-categories.controller.getProductProductCategories: found product = ' + product);

            ProductProductCategoryModel
                .find({ Product: product }, 'Product ProductCategory')
                .populate('ProductCategory Product')
                .exec(function (err, productProductCategories) {
                    if (err) {
                        res.writeHead(500);
                        return next(err);
                    } else {
                        console.log('product-product-categories.controller.getProductProductCategories: products found productProductCategories = ' + productProductCategories);
                        res.send(200, productProductCategories);
                        return next();
                    }
                });

        });

    } else {
        ProductProductCategoryModel
            .find({}, 'Product ProductCategory')
            .populate('ProductCategory Product')
            .exec(function (err, productProductCategories) {
                if (err) {
                    res.writeHead(500);
                    return next(err);
                } else {
                    console.log('product-product-categories.controller.getProductProductCategories: products found productProductCategories = ' + productProductCategories);
                    res.send(200, productProductCategories);
                    return next();
                }
            });
    }

};

export var addProductProductCategory = function (req, res, next) {

    console.log('productId = ' + req.params.productId);
    console.log('productCategory = ' + req.params.productCategory);

    ProductModel.findById(req.params.productId).exec(function (err, product) {
        if (err)
            return next(err);
        if (!product)
            return next(new Error('Failed to load product ' + req.params.productId));
        console.log('product-product-categories.controller.getProductProductCategories: found product = ' + product);

        ProductCategoryModel.findOne({ Key: req.params.productCategory }).exec(function (err, productCategory) {
            if (err) {
                res.writeHead(500);
                return next(err);
            } else {
                console.log('product-product-categories.controller.addProductProductCategory: found productCategory = ' + productCategory);


                var productProductCategory;

                try {
                    productProductCategory = new ProductProductCategoryModel({
                        Product: product,
                        ProductCategory: productCategory
                    });
                }
                catch (err) {
                    console.log('Error = ' + err);
                    throw err;
                }

                productProductCategory.save(
                    function (err, productProductCategory, numAffected) {
                        if (err) {
                            console.log(err);
                            res.writeHead(500);
                            res.end(err);
                        } else {
                            res.send(201, productProductCategory);
                        }
                    });
                return next();


            }
        });

    });

};

export var deleteProductProductCategory = function (req, res, next) {

    ProductModel.findById(req.params.productId).exec(function (err, product) {
        if (err)
            return next(err);
        if (!product)
            return next(new Error('Failed to load product ' + req.params.productId));
        console.log('product-product-categories.controller.getProductProductCategories: found product = ' + product);

        ProductCategoryModel.findOne({ Key: req.params.productCategory }).exec(function (err, productCategory) {
            if (err) {
                res.writeHead(500);
                return next(err);
            } else {
                console.log('product-product-categories.controller.addProductProductCategory: found productCategory = ' + productCategory);


                var productProductCategory;

                ProductProductCategoryModel.remove({ Product: product, ProductCategory: productCategory },
                    (err, productProductCategory) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500);
                            res.end(err);
                        } else {
                            res.send(201, { 'message': 'Product Product Category (' + product.name + ', ' + productCategory.Key + ') Successfully Removed' });
                        }
                    });


            }
        });

    });



};