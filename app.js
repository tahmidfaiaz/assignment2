var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var db = require('./config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const secureRoutes = require('./routes/secureRoutes');
const session = require('express-session');
const cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // If session user exists, user is logged in
    req.user = req.session.user;
  } else {
    // No session user, user is not logged in
    req.user = null;
  }
  next();
};

// Apply the isAuthenticated middleware globally

app.use('/', indexRouter);
app.use(isAuthenticated);
app.use('/', secureRoutes); // Mount the secure routes under /secure

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
