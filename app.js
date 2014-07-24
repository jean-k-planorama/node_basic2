
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(express); // Syntax for Express <4

var passport = require('passport')
  ,  LocalStrategy = require('passport-local').Strategy
  ,  BasicStrategy = require('passport-http').BasicStrategy
  ,  DigestStrategy = require('passport-http').DigestStrategy;

var flash = require('connect-flash');

var routes = require('./routes');
var change_pass = require('./routes/change_pass');
var signup = require('./routes/signup');
var logout= require('./routes/logout');

var User = require('planorama/user');

var app = express();

var settings = {
  cookie_secret: 'noderocks',
  db: 'test'
};

app.locals.title = 'DummySite';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.configure(function() {
  app.use(favicon());
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('keyboard cat'));
//  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(express.session({
    secret: settings.cookie_secret,
    store: new MongoStore({
      db: settings.db
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);  // Has to be AFTER app.use(flash()); !!
});


//app.use(favicon());
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(app.router);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        done(null, false, { message: err });
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


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//passport.serializeUser(function(user, done) {
//  done(null, user);
//});
//
//passport.deserializeUser(function(user, done) {
//  done(null, user);
//});


app.get('/', routes.index);
app.get('/logout', logout.get);
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/',
    successFlash: 'Successfully logged in',
    failureFlash: 'Failed to log in' })
);
app.post('/signup', signup.post);
app.post('/change_pass', change_pass.post);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
