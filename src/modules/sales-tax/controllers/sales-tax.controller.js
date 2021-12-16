'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
const florida_sales_tax_by_county_1 = require("../models/florida_sales_tax_by_county");
exports.getTaxRates = function (req, res, next) {
    let taxRates = florida_sales_tax_by_county_1.florida_county_tax;
    res.send(200, taxRates);
    return next();
};
//# sourceMappingURL=sales-tax.controller.js.map