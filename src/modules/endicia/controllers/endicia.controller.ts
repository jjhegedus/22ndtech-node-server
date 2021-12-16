'use strict';

var request = require('request');

const config = require('../../../config/config');
let logger = config.logger;
import { EndiciaShipments } from '../models/endicia-shipment.model';

var EndiciaAccountModel = require('mongoose').model('EndiciaAccount');

// !!! Only for use with Endicia Lable Server !!!
// export var createCharge = function (req, res, next) {
//     var purchaseInfo = req.body.purchaseInfo;
//     logger.info('purchaseInfo = ' + purchaseInfo);

//     let applicationFee = Math.trunc(purchaseInfo.grandTotal * 20);
//     stripe.charges.create({
//         amount: Math.trunc(purchaseInfo.grandTotal * 100),
//         currency: 'usd',
//         source: purchaseInfo.cardToken
//         ,
//         application_fee: applicationFee
//     }, {
//             stripe_account: "acct_1ALLbYEKDYj5zdFU",
//         }).then(
//         (charge) => {
//             res.send(200, charge);
//             return next();
//         });
// };

// !!! Only for use with Endicia Lable Server !!!
export var changePassPhrase = function(req, res, next) {
    var postBody = '<?xml version="1.0" encoding="utf-8"?>' +
        '<ChangePassPhraseRequest TokenRequested="false">' +
        '<RequesterID>lxxx</RequesterID>' +
        '<RequestID>1</RequestID>' +
        '<CertifiedIntermediary>' +
        '<AccountID>' + req.params.accountId + '</AccountID>' +
        '<PassPhrase>' + req.body.oldPassPhrase + '</PassPhrase>' +
        '</CertifiedIntermediary>' +
        '<NewPassPhrase>' + req.body.newPassPhrase + '</NewPassPhrase>' +
        '</ChangePassPhraseRequest>';

    var options = {
        uri: config.server.endiciaUrl + '/ChangePassPhraseXML',
        method: 'POST',
        json: true,
        form: { changePassPhraseRequestXML: postBody },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    try {

        request(
            options,
            function(err, resp, body) {
                if (resp.statusCode == 200) {
                    res.send(200, body);
                    return next();
                } else {
                    res.writeHead(500);
                    return next(err);
                }
            });

    }
    catch (err) {
        logger.error(err);
    }

};

// !!! Only for use with Endicia Lable Server !!!
export var recreditRequest = function(req, res, next) {
    var postBody = '<RecreditRequest>' +
        '<RequesterID>lxxx</RequesterID>' +
        '<RequestID>2</RequestID>' +
        '<CertifiedIntermediary>' +
        '<AccountID>' + req.params.accountId + '</AccountID>' +
        '<PassPhrase>' + req.body.passPhrase + '</PassPhrase>' +
        '</CertifiedIntermediary>' +
        '<RecreditAmount>' + req.body.recreditAmount + '</RecreditAmount>' +
        '</RecreditRequest>';

    var options = {
        uri: config.server.endiciaUrl + '/BuyPostageXML',
        method: 'POST',
        json: true,
        form: { recreditRequestXML: postBody },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    try {

        request(
            options,
            function(err, resp, body) {
                if (resp.statusCode == 200) {
                    res.send(200, body);
                    return next();
                } else {
                    res.writeHead(500);
                    return next(err);
                }
            });

    }
    catch (err) {
        logger.error(err);
    }

};

// !!! Only for use with Endicia Lable Server !!!
export var getPostagelabel = function(req, res, next) {
    var postBody = '<LabelRequest>' +
        '< RequesterID>lxxx</RequesterID>' +
        '<AccountID>' + req.params.accountId + '</AccountID>' +
        '<PassPhrase>' + req.body.passPhrase + '</PassPhrase>' +
        '<MailClass>' + req.body.mailClass + '</MailClass>' +
        '<WeightOz>' + req.body.weightOz + '</WeightOz>' +
        '<PartnerCustomerID>' + req.body.partnerCustomerId + '</PartnerCustomerID>' +
        '<PartnerTransactionID>' + req.body.partnerTransactionId + '</PartnerTransactionID>' +
        '<ToName>' + req.body.toName + '</ToName>' +
        '<ToAddress1>' + req.body.toAddress1 + '</ToAddress1>' +
        '<ToCity>' + req.body.toCity + '</ToCity>' +
        '<ToState>' + req.body.toState + '</ToState>' +
        '<ToPostalCode>' + req.body.toPostalCode + '</ToPostalCode>' +
        '<FromCompany>' + req.body.fromCompany + '</FromCompany>' +
        '<FromName>' + req.body.fromName + '</FromName>' +
        '<ReturnAddress1>' + req.body.returnAddress1 + '</ReturnAddress1>' +
        '<FromCity>' + req.body.fromCidy + '</FromCity>' +
        '<FromState>' + req.body.fromState + '</FromState>' +
        '<FromPostalCode>' + req.body.fromPostalCode + '</FromPostalCode></LabelRequest>';

    var options = {
        uri: config.server.endiciaUrl + '/BuyPostageXML',
        method: 'POST',
        json: true,
        form: { recreditRequestXML: postBody },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    try {

        request(
            options,
            function(err, resp, body) {
                if (resp.statusCode == 200) {
                    res.send(200, body);
                    return next();
                } else {
                    res.writeHead(500);
                    return next(err);
                }
            });

    }
    catch (err) {
        logger.error(err);
    }

};

export var getShipments = function(req, res, next) {
    var shipments: EndiciaShipments = new EndiciaShipments();

    shipments.getShipments(
        function(err, results, fields) {
            if (err) return next(err);
            if (!results) return next(new Error('Failed to load shipments '));


            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            res.end(JSON.stringify(results));
        });

    return next();
};

export var createShipment = function(shipment, callback) {
    var shipments: EndiciaShipments = new EndiciaShipments();
    shipments.createShipment(
        shipment,
        (err, results, fields) => {
            callback(err, results, fields);
        }
    );
}