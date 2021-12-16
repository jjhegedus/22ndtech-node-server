'use strict';

const config = require('../../../config/config');
import { florida_county_tax } from '../models/florida_sales_tax_by_county';

export var getTaxRates = function (req, res, next) {
    let taxRates = florida_county_tax;
    res.send(200, taxRates);
    return next();
}