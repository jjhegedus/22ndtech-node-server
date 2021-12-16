'use strict';

exports.renderStatus = function (req, res, next) {
    res.json({
        server: res.serverName,
        status: 'OK',
        dateTime: new Date()
    });

    return next();
};
