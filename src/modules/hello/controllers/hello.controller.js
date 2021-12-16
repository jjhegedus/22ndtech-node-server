'use strict';

exports.renderHello = function(req, res, next) {
  res.send({
    hello: req.params.name,
    world: 'wibble wobble'
  });

  return next();
};
