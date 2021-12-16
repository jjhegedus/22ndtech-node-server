/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var productProductCategorySchema = new Schema({
    Product: {
        type: Schema.ObjectId,
        ref: 'Product'
    },
    ProductCategory: {
        type: Schema.ObjectId,
        ref: 'ProductCategory'
    }
});
productProductCategorySchema.set('timestamps', true); // include timestamps in docs
productProductCategorySchema.index({ 'Product': 1, 'ProductCategory': 1 }, { unique: true });
// apply the mongoose unique validator plugin to the schema
productProductCategorySchema.plugin(uniqueValidator);
exports.ProductProductCategoryModel = mongoose.model('ProductProductCategory', productProductCategorySchema);
//# sourceMappingURL=product-product-category.model.js.map