'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroes = function (req, res, next) {
    let heroes = [
        { id: 11, name: 'Pissant' },
        { id: 12, name: 'Jackass' },
        { id: 13, name: 'Looser' },
        { id: 14, name: 'Dickhead' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' },
        { id: 17, name: 'Dynama' },
        { id: 18, name: 'Dr IQ' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado' }
    ];
    res.send(200, heroes);
    return next();
};
//# sourceMappingURL=heroes.controller.js.map