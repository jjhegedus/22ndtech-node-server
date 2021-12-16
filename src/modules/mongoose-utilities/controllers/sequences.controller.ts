const config = require('../../../config/config');
let logger = config.logger;

var SequencesModel = require('mongoose').model('Sequences');
SequencesModel.executingCallback = false;

var processing = false;

export var nextVal = function (sequenceName, callback) {
    if (processing) {
        setTimeout(function () { nextVal(sequenceName, callback); }, 1000);
    } else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate(
            { sequenceName: sequenceName },
            { $inc: { nextVal : 1 } },
            function (err, seq) {
                if (err) {
                    logger.error(err);
                    processing = false;
                    throw (err);
                }

                processing = false;
                callback(seq._doc.nextVal);
            });
    }
};

export var setPreVal = function (sequenceName, callback) {
    if (processing) {
        setTimeout(function () { setPreVal(sequenceName, callback); }, 1000);
    } else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate(
            { sequenceName: sequenceName },
            { $inc: { nextVal: -1 } },
            { new: true },
            function (err, seq) {
                if (err) {
                    logger.error(err);
                    processing = false;
                    throw (err);
                }

                processing = false;
                callback(seq._doc.nextVal);
            });
    }
};

export var setVal = function (sequenceName, newValue, callback) {
    if (processing) {
        setTimeout(function () {
            setVal(sequenceName, newValue, callback);
        }, 1000);
    } else {
        processing = true;
        var nextValDoc = SequencesModel.findOneAndUpdate(
            { sequenceName: sequenceName },
            { $set: { nextVal: newValue } },
            function (err, seq) {
                if (err) {
                    logger.error(err);
                    processing = false;
                    throw (err);
                }

                processing = false;
                callback(seq._doc.nextVal);
            });
    }
};
