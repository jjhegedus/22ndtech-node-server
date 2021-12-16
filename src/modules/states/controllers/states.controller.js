'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../../../config/config');
const states_1 = require("../models/states");
exports.getStates = function (req, res, next) {
    let returnedStates = states_1.states;
    res.send(200, returnedStates);
    return next();
};
//# sourceMappingURL=states.controller.js.map