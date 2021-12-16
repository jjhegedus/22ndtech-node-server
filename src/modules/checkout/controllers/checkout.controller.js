'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
let logger = config.logger.child({ file: 'checkout.controller.ts' });
const stripe = require('stripe')(config.server.stripe_api_key);
//const https = require('https');
var request = require('request');
var StripeSellerModel = require('mongoose').model('StripeSeller');
const endicia_shipment_model_1 = require("../../endicia/models/endicia-shipment.model");
exports.createCharge = function (req, res, next) {
    var checkoutInfo = req.body.checkoutInfo;
    logger.debug({ checkoutInfo: checkoutInfo });
    let applicationFee = Math.round(checkoutInfo.total_before_tax * 20);
    try {
        stripe.charges.create({
            amount: Math.trunc(checkoutInfo.grand_total * 100),
            currency: 'usd',
            source: checkoutInfo.cardToken,
            application_fee: applicationFee
        }, {
            stripe_account: config.server.stripe_account,
        }, (err, charge) => {
            if (err) {
                logger.error('checkout.controller.createCharge: error in stripe.charges.create err = ' + err);
                return next(err);
            }
            var shipment = new endicia_shipment_model_1.EndiciaShipment();
            shipment.first_name = checkoutInfo.nameoncard;
            shipment.last_name = '';
            shipment.company = checkoutInfo.company;
            shipment.address1 = checkoutInfo.address_line1;
            shipment.address2 = checkoutInfo.address_line2;
            shipment.city = checkoutInfo.address_city;
            shipment.zip_code = checkoutInfo.address_zip;
            shipment.email = checkoutInfo.address_email;
            shipment.phone = checkoutInfo.address_phone;
            shipment.mail_class = checkoutInfo.mail_class;
            shipment.cart_items = JSON.stringify(checkoutInfo.cartItems);
            var endicia = new endicia_shipment_model_1.EndiciaShipments();
            endicia.createShipment(shipment, (err, results, fields) => {
                if (err) {
                    logger.error('checkout.controller.createCharge: error creating shipment err = ' + err);
                    return next(err);
                }
                res.send(200, { charge: charge, results: results, fields: fields });
                return next();
            });
        });
    }
    catch (err) {
        logger.error(err);
    }
};
exports.getClientAuthToken = function (req, res, next) {
    var authorizationCode = req.body.authcode;
    var postBody = {
        client_secret: 'sk_test_LToshBf3IfXUnCNpDveFbkJk',
        code: authorizationCode,
        grant_type: 'authorization_code'
    };
    var postData = JSON.stringify(postBody);
    var options = {
        url: 'https://connect.stripe.com/oauth/token',
        method: 'POST',
        json: true,
        body: postBody
    };
    try {
        request(options, function (err, resp, body) {
            if (resp.statusCode == 200) {
                res.send(200, body);
                return next();
            }
            else {
                res.writeHead(500);
                return next(err);
            }
        });
    }
    catch (err) {
        logger.error(err);
    }
};
exports.saveStripeSeller = function (req, res, next) {
    var stripeSeller = new StripeSellerModel({
        access_token: req.body.access_token,
        livemode: req.body.livemode,
        refresh_token: req.body.refresh_token,
        token_type: req.body.token_type,
        stripe_publishable_key: req.body.stripe_publishable_key,
        stripe_user_id: req.body.stripe_user_id,
        scope: req.body.scope
    });
    stripeSeller.save(function (err, seller, numAffected) {
        if (err) {
            res.writeHead(500);
            return next(err);
        }
        else {
            res.send(200, seller);
            return next();
        }
    });
};
//# sourceMappingURL=checkout.controller.js.map