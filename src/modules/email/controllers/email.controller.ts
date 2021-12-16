var nodemailer = require('../../../config/lib/nodemailer');

export let send = function(req, res, next){
    var message = req.body;
    
    nodemailer.sesTransport.sendMail(message);

    next();
}