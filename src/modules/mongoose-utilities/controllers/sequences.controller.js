"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
var SequencesModel = require('mongoose').model('Sequences');
SequencesModel.executingCallback = false;
var processing = false;
exports.nextVal = function (sequenceName, callback) {
    if (processing) {
        setTimeout(function () { exports.nextVal(sequenceName, callback); }, 1000);
    }
    else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate({ sequenceName: sequenceName }, { $inc: { nextVal: 1 } }, function (err, seq) {
            if (err) {
                console.log('sequences.controller.ts:nextVal' + err);
                processing = false;
                throw (err);
            }
            processing = false;
            callback(seq._doc.nextVal);
        });
    }
};
exports.setPreVal = function (sequenceName, callback) {
    if (processing) {
        setTimeout(function () { exports.setPreVal(sequenceName, callback); }, 1000);
    }
    else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate({ sequenceName: sequenceName }, { $inc: { nextVal: -1 } }, { new: true }, function (err, seq) {
            if (err) {
                console.log('sequences.controller.ts:setPreVal' + err);
                processing = false;
                throw (err);
            }
            processing = false;
            callback(seq._doc.nextVal);
        });
    }
};
exports.setVal = function (sequenceName, newValue, callback) {
    if (processing) {
        setTimeout(function () {
            exports.setVal(sequenceName, newValue, callback);
        }, 1000);
    }
    else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate({ sequenceName: sequenceName }, { $set: { nextVal: newValue } }, function (err, seq) {
            if (err) {
                console.log('sequences.controller.ts:setVal' + err);
                processing = false;
                throw (err);
            }
            processing = false;
            callback(seq._doc.nextVal);
        });
    }
};
//# sourceMappingURL=sequences.controller.js.map