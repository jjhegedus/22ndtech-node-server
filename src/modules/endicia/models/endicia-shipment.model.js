"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
let logger = config.logger;
class EndiciaShipment {
}
exports.EndiciaShipment = EndiciaShipment;
class EndiciaShipmentItem {
}
exports.EndiciaShipmentItem = EndiciaShipmentItem;
class EndiciaShipments {
    constructor() {
        this.options = {
            connectionLimit: 10,
            host: config.server.endiciaDbHost,
            user: config.server.endiciaDbUser,
            password: config.server.endiciaDbPassword,
            database: config.server.endiciaDbDatabase
        };
        this.mysql = require('mysql');
        this.pool = this.mysql.createPool({
            connectionLimit: 10,
            host: config.server.endiciaDbHost,
            user: config.server.endiciaDbUser,
            password: config.server.endiciaDbPassword,
            database: config.server.endiciaDbDatabase
        });
        this.createShipmentItems = (shipment, callback) => {
            let cartItems = JSON.parse(shipment.cart_items);
            if (cartItems.length) {
                let shipmentItems = [];
                cartItems.forEach(cart_item => {
                    let shipmentItem = [
                        shipment.order_number,
                        shipment.first_name,
                        shipment.last_name,
                        shipment.company,
                        shipment.address1,
                        shipment.address2,
                        shipment.address3,
                        shipment.address4,
                        shipment.city,
                        shipment.state,
                        shipment.zip_code,
                        shipment.country,
                        shipment.email,
                        shipment.phone,
                        shipment.mail_class,
                        cart_item.product.name,
                        cart_item.quantity
                    ];
                    shipmentItems.push(shipmentItem);
                });
                this.pool.query('INSERT INTO shipment_items (order_number, first_name, last_name, company, address1, address2, address3, address4, city, state, zip_code, country, email, phone, mail_class, product_name, quantity) VALUES ?', [shipmentItems], (err, results, fields) => {
                    callback(err, results, fields);
                });
            }
        };
        this.createShipment = (shipment, callback) => {
            // logger.debug('options = ', this.options);
            this.pool.query('INSERT INTO shipments SET ?', shipment, (err, results, fields) => {
                if (!err) {
                    shipment.order_number = results.insertId;
                    this.createShipmentItems(shipment, (err, results, fields) => {
                        callback(err, results, fields);
                    });
                }
                else {
                    callback(err, results, fields);
                }
            });
        };
    }
    getShipments(callback) {
        this.pool.query('SELECT * from shipments', callback);
    }
}
exports.EndiciaShipments = EndiciaShipments;
//# sourceMappingURL=endicia-shipment.model.js.map