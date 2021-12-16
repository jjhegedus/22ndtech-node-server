/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var productAttributeSchema = new Schema({
    Key: { type: String, required: true, index: true, unique: true },
    DisplayIndex: { type: Number},
    NextValueDisplayIndex: {type: Number}
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

export
    var ProductAttributeModel = mongoose.model('ProductAttribute', productAttributeSchema);