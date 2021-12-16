/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var settingsSchema = new Schema({
    name: { type: String, required: true, index: true, unique: true },
    type: { type: String, required: true },
    value: { type: String, required: true }
});
settingsSchema.set('timestamps', true); // include timestamps in docs
// apply the mongoose unique validator plugin to the schema
settingsSchema.plugin(uniqueValidator);
exports.SettingsModel = mongoose.model('Settings', settingsSchema);
//# sourceMappingURL=settings.model.js.map