// Dependencies

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var MongoStore = require('connect-mongo')(express); // Syntax for Express <4

var passport = require('passport');
var passportInit = require('./middlewares/passportInit');

var flash = require('connect-flash');

var routes = require('./routes');
var changePass = require('./routes/changePass');
var signup = require('./routes/signup');
var logout= require('./routes/logout');


var app = express();

// Settings
var settings = {
  cookie_secret: 'noderocks',
  db: 'test'
};

var routesPath = path.join(process.cwd(), 'routes');

app.locals.title = 'DummySite';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.configure(function() {
  app.use(favicon());
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session());  // complementary to passport.session() because necessary to use flash()
  passportInit(app, settings);
  app.use(flash());
  app.use(app.router);  // Has to be AFTER app.use(flash()); !!
});

//// Declare all routes using a single loop
//[
//  'index',
//  'login',
//  'logout',
//  'signup',
//  'changePass'
//].forEach(function(routeName) {
//    return require(path.join(routesPath, routeName))(app);
//  });

app.get('/', routes.index);
app.get('/logout', logout.get);
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/',
    successFlash: 'Successfully logged in',
    failureFlash: 'Failed to log in' })
);
app.post('/signup', signup.post);
app.post('/change-pass', changePass.post);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'develop') {  // FIXME called before it's set, no ?
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
