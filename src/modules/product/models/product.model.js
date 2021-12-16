/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var Currency = mongoose.Types.Currency;
var productSchema = new Schema({
    name: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: true },
    price: { type: Currency, required: true }
});
productSchema.set('timestamps', true); // include timestamps in docs
// apply the mongoose unique validator plugin to widgetSchema
productSchema.plugin(uniqueValidator);
// use mongoose currency to transform price
productSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        ret.price = Number(ret.price / 100).toFixed(2);
        delete ret.__v; // hide
        delete ret._id; // hide
    }
});
exports.ProductModel = mongoose.model('Product', productSchema);
//# sourceMappingURL=product.model.js.map