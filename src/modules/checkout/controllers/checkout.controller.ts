'use strict';

const stripe = require('stripe')('sk_test_vVsO3f7RSTWpPpgSzNUDjlZq');
//const https = require('https');
var request = require('request');

const config = require('../../../config/config');

var StripeSellerModel = require('mongoose').model('StripeSeller');

import { EndiciaShipments, Shipment } from '../../endicia/models/endicia-shipment.model';

export var createCharge = function (req, res, next) {
    var checkoutInfo = req.body.checkoutInfo;
    console.log('checkoutInfo = ' + JSON.stringify(checkoutInfo));

    let applicationFee = Math.round(checkoutInfo.total_before_tax * 20);

    try {
        stripe.charges.create({
            amount: Math.trunc(checkoutInfo.grand_total * 100),
            currency: 'usd',
            source: checkoutInfo.cardToken
            ,
            application_fee: applicationFee
        }, {
                stripe_account: "acct_1AMR7nGGCQVVZE9Z",
            }, (err, charge) => {
                if (err) {

                    console.log('checkout.controller.createCharge: error in stripe.charges.create err = ' + err);
                    return next(err);
                }

                var shipment: Shipment = new Shipment();
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

                var endicia: EndiciaShipments = new EndiciaShipments();

                endicia.createShipment(
                    shipment,
                    (err, results, fields) => {

                        if (err) {
                            console.log('checkout.controller.createCharge: error creating shipment err = ' + err);
                            return next(err);
                        }

                        res.send(200, { charge: charge, results: results, fields: fields });
                        return next();
                    })

            });
    } catch (err) {
        console.log('err = ' + err);
    }

};

export var getClientAuthToken = function (req, res, next) {
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
    }

    try {

        request(
            options,
            function (err, resp, body) {
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
        console.log(err);
    }

};

export var saveStripeSeller = function (req, res, next) {
    var stripeSeller = new StripeSellerModel({
        access_token: req.body.access_token,
        livemode: req.body.livemode,
        refresh_token: req.body.refresh_token,
        token_type: req.body.token_type,
        stripe_publishable_key: req.body.stripe_publishable_key,
        stripe_user_id: req.body.stripe_user_id,
        scope: req.body.scope
    });

    stripeSeller.save(
        function (err, seller, numAffected) {
            if (err) {
                res.writeHead(500);
                return next(err);
            } else {
                res.send(200, seller);
                return next();
            }
        });
}