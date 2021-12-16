'use strict';

const aws = require('aws-sdk');
const config = require('../../../config/config');

var mongoose = require('mongoose');

var ProductImageModel = mongoose.model('ProductImage');
var ProductModel = mongoose.model('Product');

let s31 = new aws.S3();

import { AwsS3 } from '../../aws-s3/controllers/aws-s3.lib';

const sequencesController = require('../../mongoose-utilities/controllers/sequences.controller');



export var sign = function (req, res, next) {
    try {

        let s3 = new aws.S3();
        let awsS3 = new AwsS3();

        let options = {
            Bucket: config.aws.mainSiteBucket,
            Key: 'img/' + req.query.product_id + "/" + req.query.file_name,
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

export var getAuthorizationHeader = function (req, res, next) {
    let s3 = new aws.S3();
    let awsS3 = new AwsS3();

    let headers = {};
    awsS3.addAuthorizationHeader(headers, 'DELETE', 'img/' + req.query.product_id + "/" + req.query.file_name);

    res.json(headers);
};

export var deleteMainProductImage = function (req, res, next) {

    try {

        let options = {
            Bucket: config.aws.mainSiteBucket,
            Key: 'img/' + req.query.product_id + "/" + req.query.file_name
        }

        s31.deleteObject(options, function (err, data) {
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

export var getMainProductImage = function (req, res, next) {
    this.productId = req.params.productId;

    ProductImageModel.findOne({ Product: this.productId }, (err, productImage) => {
        if (err) {
            res.writeHead(500);
            return next(err);
        } else {
            res.send(200, productImage);
            return next();
        }
    });
}

export var getProductImages = function (req, res, next) {
    this.productId = req.params.productId;

    try {

        let options = {
            Bucket: config.aws.mainSiteBucket,
            Prefix: "img/" + this.productId
        }

        s31.listObjects(options, (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.send(err);
            } else {
                let s3Orphans = data.Contents.slice();
                ProductImageModel.find({ Product: this.productId }, (err, productImages) => {
                    if (err) {
                        res.writeHead(500);
                        return next(err);
                    } else {

                        for (var i = 0; i < productImages.length; i++) {
                            let dbImage = productImages[i];
                            let s3Image = data.Contents.find(s3ProductImage => {
                                return s3ProductImage.Key == dbImage._doc.Key;
                            });

                            if (s3Image) {
                                // There was a match.  Remove the record from s3Orphans
                                s3Orphans.splice(s3Orphans.indexOf(s3Image), 1);
                                s3Image._id = dbImage._doc._id;
                                s3Image.DisplayIndex = dbImage.DisplayIndex;
                            } else {
                                // Nothing in s3 for an element in the database
                                // Gotta delete the record from the database
                                dbImage.remove(err => {
                                    if (err) {
                                        console.log(err);
                                        res.writeHead(500);
                                        return res.send(err);
                                    }
                                });
                            }
                        }

                        // If we have any s3Orphans we need to create them in the database
                        if (s3Orphans.length) {
                            // We'll need the product record to tie the images
                            // back to
                            ProductModel.findById(this.productId).exec((err, product) => {
                                if (err) {
                                    next(err);
                                } else {
                                    var recordsProcessed = 0;
                                    var numOrphans = s3Orphans.length;
                                    for (var i = 0; i < numOrphans; i++) {
                                        let productImage = new ProductImageModel(s3Orphans[i]);
                                        productImage._doc.Product = product._id;
                                        productImage.save(err => {
                                            if (err) {
                                                next(err);
                                            }
                                            recordsProcessed++;

                                            let s3Image = data.Contents.find(s3ProductImage => {
                                                return s3ProductImage.Key == productImage.Key;
                                            });

                                            if (s3Image) {
                                                s3Image._id = productImage._id;
                                                s3Image.DisplayIndex = productImage.DisplayIndex;
                                            }

                                            if (recordsProcessed == numOrphans) {
                                                data.Contents.sort((left, right) => {
                                                    return left.DisplayIndex - right.DisplayIndex;
                                                });
                                                res.json(data.Contents);
                                                return next();
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            data.Contents.sort((left, right) => {
                                return left.DisplayIndex - right.DisplayIndex;
                            });
                            res.json(data.Contents);
                            return next();
                        }
                    }
                });

            }
        });
    }
    catch (err) {
        throw err;
    }
}

export var deleteProductImage = function (req, res, next) {
    // Find all records for the product that have a display index greater than
    // or equal to the display index of the selected image.  Sort by display index.
    // Delete the selected/ image (the lowest display index) and update the rest by
    // subtracting one from the display index
    //const imageId = mongoose.Types.ObjectId(req.params.imageId);
    ProductImageModel.findByIdAndRemove(req.params.imageId)
        .populate('Product')
        .exec((err, doc) => {
            if (err) {
            }

            try {
                let options = {
                    Bucket: config.aws.mainSiteBucket,
                    Key: doc._doc.Key
                }

                s31.deleteObject(options, function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.send(err);
                    } else {
                        // delete the records from the database
                        ProductImageModel.update(
                            {
                                $and: [
                                    { Product: doc._doc.Product }, 
                                    { DisplayIndex: { $gt: doc._doc.DisplayIndex }
                                }]
                            },
                            { $inc: { DisplayIndex: -1 } },
                            { multi: true, runValidators: true },
                            function (err, rawResponse) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    sequencesController.setPreVal('product-image-seq', preVal => {
                                        res.json(rawResponse);
                                    });

                                }
                            });

                    }
                });
            }
            catch (err) {
                throw err;
            }
        });


}

export var moveUp = function (req, res, next) {
    var imageId = req.params.imageId;

    ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: -1 } })
        .populate('Product')
        .exec((err, doc) => {
            if (err) {
            }

            var newDisplayIndex = doc._doc.DisplayIndex - 1;

            ProductImageModel.update(
                {
                    $and: [{ Product: doc._doc.Product }, {
                        DisplayIndex: { $eq: newDisplayIndex }
                    }]
                },
                { $inc: { DisplayIndex: +1 } },
                { runValidators: true },
                (err, rawResponse) => {
                    if (err) {
                        console.log(err);
                    } else {
                        ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: newDisplayIndex } })
                            .populate('Product')
                            .exec(
                            (err, innerDoc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    ProductImageModel.
                                        find({ Product: doc._doc.Product.id })
                                        .sort({ DisplayIndex: 1 })
                                        .exec(
                                        (err, productImages) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                res.json(productImages);
                                            }
                                        });
                                    //res.json(rawResponse);
                                }
                            });
                    }
                });


        });

}

export var moveDown = function (req, res, next) {
    var imageId = req.params.imageId;

    ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: -1 } })
        .populate('Product')
        .exec((err, doc) => {
            if (err) {
            }

            var newDisplayIndex = doc._doc.DisplayIndex + 1;

            ProductImageModel.update(
                {
                    $and: [{ Product: doc._doc.Product }, {
                        DisplayIndex: { $eq: newDisplayIndex }
                    }]
                },
                { $inc: { DisplayIndex: -1 } },
                { runValidators: true },
                (err, rawResponse) => {
                    if (err) {
                        console.log(err);
                    } else {
                        ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: newDisplayIndex } })
                            .populate('Product')
                            .exec(
                            (err, innerDoc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    ProductImageModel.
                                        find({ Product: doc._doc.Product.id })
                                        .sort({ DisplayIndex: 1 })
                                        .exec(
                                        (err, productImages) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                res.json(productImages);
                                            }
                                        });
                                    //res.json(rawResponse);
                                }
                            });
                    }
                });


        });
}

export var moveTo = function (req, res, next) {
    var imageId = req.params.imageId;
    var newDisplayIndex = req.params.newDisplayIndex;

    ProductImageModel.findById(
        imageId)
        .populate('Product')
        .exec((err, doc) => {
            if (err) {
            }
            var oldDisplayIndex = doc._doc.DisplayIndex;
            if (newDisplayIndex < oldDisplayIndex) { // moving up
                // set the old record displayIndex to -1
                ProductImageModel.findByIdAndUpdate(
                    imageId,
                    { $set: { DisplayIndex: -1 } })
                    .populate('Product')
                    .exec((err, doc) => {
                        if (err) {
                        }

                        // increment the display index for every record where the
                        // displayIndex is less than the oldDisplayIndex and greater 
                        // than or equal to the newDisplayIndex
                        ProductImageModel.find(
                            {
                                $and: [
                                    { Product: doc._doc.Product },
                                    { DisplayIndex: { $gte: newDisplayIndex } },
                                    { DisplayIndex: { $lt: oldDisplayIndex } },
                                ]
                            }
                        )
                            .sort({ DisplayIndex: -1 })
                            .exec((err, docs1) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var numUpdates1 = 0;
                                    for (var i1 = 0; i1 < docs1.length; i1++) {
                                        var rec = docs1[i1];

                                        ProductImageModel.findByIdAndUpdate(
                                            rec._id,
                                            {
                                                $inc: { DisplayIndex: 1 }
                                            })
                                            .exec((err, doc) => {
                                                if (err) {
                                                    next(err)
                                                }
                                                numUpdates1++;

                                                if (numUpdates1 == docs1.length) {
                                                    // finally set the original record to the newDisplayIndex
                                                    ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: newDisplayIndex } })
                                                        .populate('Product')
                                                        .exec(
                                                        (err, innerDoc) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.json(err);
                                                            } else {
                                                                ProductImageModel.
                                                                    find({ Product: doc._doc.Product.id })
                                                                    .sort({ DisplayIndex: 1 })
                                                                    .exec(
                                                                    (err, productImages) => {
                                                                        if (err) {
                                                                            return next(err);
                                                                        } else {
                                                                            res.json(productImages);
                                                                        }
                                                                    });
                                                                //res.json(docs1);
                                                            }
                                                        });

                                                }
                                            });

                                    }

                                }
                            });
                    });
            }
            else {// moving down
                // set the old record displayIndex to -1
                ProductImageModel.findByIdAndUpdate(
                    imageId,
                    { $set: { DisplayIndex: -1 } })
                    .populate('Product')
                    .exec((err, doc) => {
                        if (err) {
                        }


                        // decrement the display index for every record where the
                        // displayIndex is less than or equal to the newDisplayIndex 
                        // and greater than the oldDisplayIndex
                        ProductImageModel.find(
                            {
                                $and: [
                                    { Product: doc._doc.Product },
                                    { DisplayIndex: { $lte: newDisplayIndex } },
                                    { DisplayIndex: { $gt: oldDisplayIndex } },
                                ]
                            })
                            .sort({ DisplayIndex: 1 })
                            //,
                            //{ $inc: { DisplayIndex: -1 } },
                            //{ runValidators: true },
                            .exec((err, docs1) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var numUpdates2 = 0;
                                    for (var i2 = 0; i2 < docs1.length; i2++) {
                                        var rec = docs1[i2];

                                        ProductImageModel.findByIdAndUpdate(
                                            rec._id,
                                            {
                                                $inc: { DisplayIndex: -1 }
                                            })
                                            .exec((err, doc) => {
                                                if (err) {
                                                    next(err)
                                                }

                                                numUpdates2++;

                                                if (numUpdates2 == docs1.length) {
                                                    // finally set the original record to the newDisplayIndex
                                                    ProductImageModel.findByIdAndUpdate(imageId, { $set: { DisplayIndex: newDisplayIndex } })
                                                        .populate('Product')
                                                        .exec(
                                                        (err, innerDoc) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.json(err);
                                                            } else {
                                                                ProductImageModel.
                                                                    find({ Product: doc._doc.Product.id })
                                                                    .sort({ DisplayIndex: 1 })
                                                                    .exec(
                                                                    (err, productImages) => {
                                                                        if (err) {
                                                                            return next(err);
                                                                        } else {
                                                                            res.json(productImages);
                                                                        }
                                                                    });
                                                                //res.json(docs1);
                                                            }
                                                        });

                                                }
                                            });
                                    }
                                }
                            });
                    });
            }

        });
}