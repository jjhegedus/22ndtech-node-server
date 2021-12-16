"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require('../../../config/lib/nodemailer');
exports.send = function (req, res, next) {
    var message = req.body;
    nodemailer.sesTransport.sendMail(message);
    next();
};
//# sourceMappingURL=email.controller.js.map