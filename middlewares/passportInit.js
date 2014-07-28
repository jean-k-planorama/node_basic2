
// dependencies

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(express); // Syntax for Express <4

// internal requirements

var config = require('../modules/config');
var User = require('../models/user');


/**
 * Handles the passport configuration for the express app
 *
 * @param app
 * @param settings
 * @returns app
 */
var passportInit = function passportInit(app) {

  //  Initialize passport

  app.use(express.session({
    secret: 'nodeRocks',
    store: new MongoStore({
      db: config.dbName
    })
  }));  // complementary to passport.session() because necessary to use flash()
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
    User.findById(id, done);
  });

  return app;
};


module.exports = passportInit;