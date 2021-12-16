
export class Shipment{
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
}

export class EndiciaShipments {
    mysql = require('mysql');
    pool = this.mysql.createPool({
        connectionLimit: 10,
        host: 'ec2-34-207-115-234.compute-1.amazonaws.com',
        user: '22ndtech',
        password: 'mypassword',
        database: '22ndtech'
    });

    getShipments(callback) {
        this.pool.query('SELECT * from shipments', callback);
    }

    createShipment(shipment: Shipment, callback) {
        this.pool.query('INSERT INTO shipments SET ?',
            shipment,
            (err, results, fields) => {
                callback(err, results, fields);
            })
    }

}