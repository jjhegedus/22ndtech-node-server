/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var productAttributeSchema = new Schema({
    Key: { type: String, required: true, index: true, unique: true },
    DisplayIndex: { type: Number },
    NextValueDisplayIndex: { type: Number }
});
productAttributeSchema.set('timestamps', true); // include timestamps in docs
productAttributeSchema.pre('validate', function (next) {
    if (!this.DisplayIndex) {
        const sequencesController = require('../../mongoose-utilities/controllers/sequences.controller');
        sequencesController.nextVal('product-attribute-seq', nextVal => {
            this.DisplayIndex = nextVal;
            next();
        });
    }
});
// apply the mongoose unique validator plugin to the schema
productAttributeSchema.plugin(uniqueValidator);
exports.ProductAttributeModel = mongoose.model('ProductAttribute', productAttributeSchema);
//# sourceMappingURL=product-attribute.model.js.map