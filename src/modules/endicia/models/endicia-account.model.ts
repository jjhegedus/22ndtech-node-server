/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var Currency = mongoose.Types.Currency;

var endiciaAccountSchema = new Schema({
    accountId: { type: String, required: true, index: true, unique: true }
    , passPhrase: { type: String, required: true }
    , postageBalance: { type: Currency, required: false }
});

endiciaAccountSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to widgetSchema
endiciaAccountSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
endiciaAccountSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        ret.postageBalance = Number(ret.postageBalance / 100).toFixed(2);
        delete ret.__v; // hide
        delete ret._id; // hide
    }
});

export
    var EndiciaAccountModel = mongoose.model('EndiciaAccount', endiciaAccountSchema);
