var passport = require('./passport-strategies/local.js').getLocal()
var mongoose = require('mongoose');

module.exports.init = function () {
    var User = mongoose.model('User');

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('passport.deserializeUser: id = ' + id + ' done = ' + done)
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
};