
// External dependencies

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Internal requirements

var User = require('../models/user');


/**
 * passportInit
 *
 * @info Handles the initialization of passport sessions for the app
 *
 * @param app
 * @returns {*}
 */
var passportInit = function passportInit(app) {

  //  Passport session initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // defines a standard authentification strategy for Users
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({username: username}, function (err, user) {
        if (err) {
          return done(null, false, { message: err });
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      });
    }
  ));

  // defines how to serialize a user within a session object (by its ID)
  passport.serializeUser(function(user, done) {
    return done(null, user._id);
  });

  // defines how to retrieve the user from a session object (by its ID)
  passport.deserializeUser(function(id, done) {
    return User.findById(id, done);
  });

  return app;
};


module.exports = passportInit;