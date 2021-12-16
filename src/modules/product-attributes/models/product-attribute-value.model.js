/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var productAttributeValueSchema = new Schema({
    ProductAttribute: {
        type: Schema.ObjectId,
        ref: 'ProductAttribute'
    },
    Key: { type: String, required: true },
    DisplayIndex: { type: Number }
});
productAttributeValueSchema.set('timestamps', true); // include timestamps in docs
productAttributeValueSchema.index({ 'ProductAttribute': 1, 'Key': 1 }, { unique: true });
productAttributeValueSchema.pre('validate', function (next) {
    if (!this.DisplayIndex) {
        getNextDisplayIndex(this.ProductAttribute, (nextDisplayIndex, thisObject) => {
            thisObject._doc.DisplayIndex = nextDisplayIndex;
            next();
        }, this);
    }
});
// apply the mongoose unique validator plugin to the schema
productAttributeValueSchema.plugin(uniqueValidator);
exports.ProductAttributeValueModel = mongoose.model('ProductAttributeValue', productAttributeValueSchema);
var getNextDisplayIndex = (productAttributeId, callback, thisObject) => {
    exports.ProductAttributeValueModel
        .findOne({ ProductAttribute: productAttributeId }, 'DisplayIndex')
        .sort({ DisplayIndex: -1 })
        .exec((err, productAttributeValue) => {
        if (err) {
            throw err;
        }
        else if (!productAttributeValue) {
            callback(1, thisObject);
        }
        else {
            callback(productAttributeValue._doc.DisplayIndex + 1, thisObject);
        }
    });
};
//# sourceMappingURL=product-attribute-value.model.js.map