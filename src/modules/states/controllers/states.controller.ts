'use strict';

const config = require('../../../config/config');
import { states } from '../models/states';

export var getStates = function (req, res, next) {
    let returnedStates = states;
    res.send(200, returnedStates);
    return next();
}