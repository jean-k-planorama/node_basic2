// Dependencies

var express = require('express');
//var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var passportInit = require('./middlewares/passportInit');

var flash = require('connect-flash');

var routes = require('./routes');
var changePass = require('./routes/changePass');
var signup = require('./routes/signup');
var logout= require('./routes/logout');


var app = express();



var routesPath = path.join(process.cwd(), 'routes');

var config = require('./modules/config');

app.set('env', process.env.NODE_ENV || 'develop');
app.set('port', process.env.PORT || 3000);

app.locals.title = 'DummySite';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.configure(function() {
  app.use(favicon());
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('keyboard cat'));
  passportInit(app);
  app.use(flash());
  app.use(app.router);  // Has to be AFTER app.use(flash()); !!
});

// Declare all routes using a single loop
[
  'index',
  'login',
  'logout',
  'signup',
  'changePass'
].forEach(function(routeName) {
    return require(path.join(routesPath, routeName))(app);
  });


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
