// External dependencies

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(express); // Syntax for Express <4

// Internal requirements

var config = require('../modules/config');

var passportInit = require('./middlewares/passportInit');


// App initialization


var app = express();

var routesPath = path.join(process.cwd(), 'routes');


app.set('env', process.env.NODE_ENV || 'dev');
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
  // session initialization (complementary to passport.session() because necessity to use flash())
  app.use(express.session({
    secret: 'nodeRocks',
    store: new MongoStore({
      db: config.dbName
      // later: add here username, password... from config
    })
  }));
  app.use(flash());
  // passport initialization for authentification
  passportInit(app);
  // Has to be done only at the end of flash and passport initialization
  app.use(app.router);
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
if (app.get('env') === 'dev') {
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
