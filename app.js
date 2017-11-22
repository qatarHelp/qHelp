var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = require('express-myconnection');
var session = require('express-session');

const sqlite3 = require('sqlite3').verbose();
var db = require('./sql/db_manage.js');

var index = require('./routes/index');
var users = require('./routes/users');
//var fun = require('./public/javascripts/fun.js');


var app = express();

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
//Start sessions
app.use(session({
  secret: 'Muhsin is the 5th member.',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 10 * 60 * 1000

  },
  rolling: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', index);
app.use('/users', users);
//app.use(fun);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
