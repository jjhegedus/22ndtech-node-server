/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var productCategorySchema = new Schema({
    Key: { type: String, required: true, index: true, unique: true },
    DisplayIndex: { type: Number },
    ImageUrl: { type: String }
});
productCategorySchema.set('timestamps', true); // include timestamps in docs
productCategorySchema.pre('validate', function (next) {
    if (!this.DisplayIndex) {
        const sequencesController = require('../../mongoose-utilities/controllers/sequences.controller');
        sequencesController.nextVal('product-categories-seq', nextVal => {
            this.DisplayIndex = nextVal;
            next();
        });
    }
});
// apply the mongoose unique validator plugin to the schema
productCategorySchema.plugin(uniqueValidator);
exports.ProductCategoryModel = mongoose.model('ProductCategory', productCategorySchema);
//# sourceMappingURL=product-category.model.js.map