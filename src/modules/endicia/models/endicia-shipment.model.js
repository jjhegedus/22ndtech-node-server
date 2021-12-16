"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shipment {
}
exports.Shipment = Shipment;
class EndiciaShipments {
    constructor() {
        this.mysql = require('mysql');
        this.pool = this.mysql.createPool({
            connectionLimit: 10,
            host: 'ec2-34-207-115-234.compute-1.amazonaws.com',
            user: '22ndtech',
            password: 'mypassword',
            database: '22ndtech'
        });
    }
    getShipments(callback) {
        this.pool.query('SELECT * from shipments', callback);
    }
    createShipment(shipment, callback) {
        this.pool.query('INSERT INTO shipments SET ?', shipment, (err, results, fields) => {
            callback(err, results, fields);
        });
    }
}
exports.EndiciaShipments = EndiciaShipments;
//# sourceMappingURL=endicia-shipment.model.js.map