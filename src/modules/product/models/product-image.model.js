/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
//var SettingsModel = require('mongoose').model('Settings');
var SettingsModel = require('../../settings/models/settings.model');
var Schema = mongoose.Schema;
var productImageSchema = new Schema({
    Key: { type: String, required: true, index: true, unique: true },
    LastModified: { type: Date, required: true },
    ETag: { type: String, required: true },
    Size: { type: Number, required: true },
    StorageClass: { type: String, required: true },
    Product: {
        type: Schema.ObjectId,
        ref: 'Product'
    }, DisplayIndex: { type: Number }
});
productImageSchema.set('timestamps', true); // include timestamps in docs
// productImageSchema.index({ 'Product': 1, 'DisplayIndex': 1 }, { unique: true });
productImageSchema.pre('validate', function (next) {
    if (!this._doc.DisplayIndex) {
        getNextDisplayIndex(this.Product, (nextDisplayIndex, thisObject) => {
            thisObject._doc.DisplayIndex = nextDisplayIndex;
            next();
        }, this);
    }
});
// apply the mongoose unique validator plugin to the schema
productImageSchema.plugin(uniqueValidator);
exports.ProductImageModel = mongoose.model('ProductImage', productImageSchema);
var getNextDisplayIndex = (productId, callback, thisObject) => {
    exports.ProductImageModel
        .findOne({ Product: productId }, 'DisplayIndex')
        .sort({ DisplayIndex: -1 })
        .exec((err, productImage) => {
        if (err) {
            throw err;
        }
        else if (!productImage) {
            callback(1, thisObject);
        }
        else {
            callback(productImage._doc.DisplayIndex + 1, thisObject);
        }
    });
};
//# sourceMappingURL=product-image.model.js.map