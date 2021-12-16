'use strict';

const aws = require('aws-sdk');
const config = require('../../../config/config');
let logger = config.logger;

let s3 = new aws.S3();

var ProductModel = require('mongoose').model('Product');
var ProductProductCategoryModel = require('mongoose').model('ProductProductCategory');

export var getProducts = function (req, res, next) {

    ProductModel.find({}, 'id name description price', function (err, products) {
        if (err) {
            res.writeHead(500);
            return next(err);
        } else {
            res.send(200, products);
            return next();
        }
    });

};

export var getProduct = function (req, res, next) {

    ProductModel.findById(req.params.id).exec(function (err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Failed to load product ' + req.params.id));

        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });

        res.end(JSON.stringify(product));
    });

    return next();
};

export var addProducts = function (req, res, next) {

    if (Object.prototype.toString.call(req.body) === '[object Array]') {
        var promises = [];

        for (var i = 0; i < req.body.length; i++) {

            promises.push(
                new Promise(function (resolve, reject) {

                    var currentProduct = req.body[i];
                    var product;

                    ProductModel.findOne({ 'name': currentProduct.name }).exec(function (err, prod) {

                        try {
                            if (err) {
                                throw err;
                            }

                            if (prod) {
                                throw 'Unable to insert duplicate name ' + currentProduct.name;
                            } else {
                                product = new ProductModel({
                                    name: currentProduct.name,
                                    description: currentProduct.description,
                                    price: currentProduct.price
                                });

                                product.save(
                                    function (err, p, numAffected) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            resolve(p);
                                        }
                                    });
                            }
                        }
                        catch (err) {
                            logger.error('Error = ' + err);
                            reject(err);
                        }
                    });
                }));
        };



        Promise.all(promises)
            .then(function (response) {
                res.send(201, response);
                return next();
            })
            .catch(function (error) {
                logger.error(error);
                res.writeHead(500);
                return next(error);
            });
    } else {
        var product;

        ProductModel.findOne({ 'name': req.body.name }).exec(function (err, product) {

            if (err) return next(err);
            if (product) {
                logger.error({ message: 'Unable to insert duplicate name', productName: req.body.name });
                res.writeHead(500);
                res.end('Unable to insert duplicate name ' + req.body.name);
                return next();
            } else {
                try {
                    product = new ProductModel({
                        name: req.body.name,
                        description: req.body.description,
                        price: req.body.price
                    });
                }
                catch (err) {
                    logger.error(err);
                    throw err;
                }

                product.save(
                    function (err, product, numAffected) {
                        if (err) {
                            logger.error(err);
                            res.writeHead(500);
                            res.end(err);
                        } else {
                            res.send(201, product);
                        }
                    });
                return next();
            }
        });

    }
};

export var deleteAllProducts = function (req, res, next) {

    ProductModel.remove({},
        function (err, product) {
            if (err) {
                logger.error(err);
                res.writeHead(500);
                res.end(err);
            } else {
                res.send(201, { 'message': 'All Products (' + product.result.n + ') Successfully Removed' });
            }
        });

};

export var deleteProduct = function (req, res, next) {


    ProductProductCategoryModel.remove({ Product: new Object(req.params.id) },
        (err, productProductCategory) => {
            if (err) {
                logger.error(err);
                res.writeHead(500);
                res.end(err);
            } else {
                ProductModel.findByIdAndRemove(new Object(req.params.id), function (err, product) {
                    if (err) {
                        res.status(500);
                        res.json({
                            type: false,
                            data: 'Error occured in deleteProduct (' + req.params.id + '): ' + err
                        })
                    } else {
                        res.status(201);
                        res.json({
                            "message": 'Product id: ' + req.params.id + ' deleted successfully'
                        })
                    }
                })
            }
        });
}

export var updateProducts = function (req, res, next) {
    var newProduct = req.body;

    ProductModel.findById(new Object(req.params.id), function (err, product) {

        if (err) return next(err);
        if (product) {
            if (newProduct.name && (newProduct.name !== product.name)) {
                product.name = newProduct.name;
            }

            if (newProduct.description && (newProduct.description !== product.description)) {
                product.description = newProduct.description;
            }

            if (newProduct.price && (newProduct.price !== product.price)) {
                product.price = newProduct.price;
            }

            product.save(
                function (err, product, numAffected) {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500);
                        res.end(err);
                    } else {
                        res.send(201, product);
                    }
                });
            return next();
        } else {
            return next(new Error('Unable to find product with id = ' + req.params.id));
        }
    });

}