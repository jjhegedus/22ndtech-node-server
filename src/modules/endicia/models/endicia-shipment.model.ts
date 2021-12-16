
import { CartItem } from '22ndtech-common-lib';
const config = require('../../../config/config');
let logger = config.logger;

export class EndiciaShipment {
    order_number: number;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    email: string;
    phone: string;
    mail_class: string;
    cart_items: string;
}

export class EndiciaShipmentItem {
    order_number: number;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    email: string;
    phone: string;
    mail_class: string;
    product_name: string;
    quantity: number;
}

export class EndiciaShipments {
    options = {
        connectionLimit: 10,
        host: config.server.endiciaDbHost,
        user: config.server.endiciaDbUser,
        password: config.server.endiciaDbPassword,
        database: config.server.endiciaDbDatabase
    };
    mysql = require('mysql');
    pool = this.mysql.createPool({
        connectionLimit: 10,
        host: config.server.endiciaDbHost,
        user: config.server.endiciaDbUser,
        password: config.server.endiciaDbPassword,
        database: config.server.endiciaDbDatabase
    });

    getShipments(callback) {
        this.pool.query('SELECT * from shipments', callback);
    }

    createShipmentItems = (shipment: EndiciaShipment, callback) => {
        let cartItems: CartItem[] = JSON.parse(shipment.cart_items);

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
                ]

                shipmentItems.push(shipmentItem);
            });

            this.pool.query('INSERT INTO shipment_items (order_number, first_name, last_name, company, address1, address2, address3, address4, city, state, zip_code, country, email, phone, mail_class, product_name, quantity) VALUES ?',
            [shipmentItems],
            (err, results, fields) => {
                callback(err, results, fields);
            })

        }
    }

    createShipment = (shipment: EndiciaShipment, callback) => {
        // logger.debug('options = ', this.options);

        this.pool.query('INSERT INTO shipments SET ?',
            shipment,
            (err, results, fields) => {
                if (!err) {
                    shipment.order_number = results.insertId;

                    this.createShipmentItems(shipment,
                        (err, results, fields) => {
                            callback(err, results, fields);
                        });
                } else {
                    callback(err, results, fields);
                }
            })
    }

}