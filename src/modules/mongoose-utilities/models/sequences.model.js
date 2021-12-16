/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var sequencesSchema = new Schema({
    sequenceName: { type: String, required: true, index: true, unique: true },
    nextVal: { type: Number, required: true }
});
// apply the mongoose unique validator plugin to the schema
sequencesSchema.plugin(uniqueValidator);
exports.sequencesModel = mongoose.model('Sequences', sequencesSchema);
//# sourceMappingURL=sequences.model.js.map