const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const apiRouter = require('./routes');
const authRouter = require('./routes/authRouter');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../build')));

// app.use('/api', apiRouter);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/auth', authRouter);
app.use(
  '/api',
  process.env.NODE_ENV === 'production'
    ? passport.authenticate('jwt', { session: false })
    : (req, res, next) => next(),
  apiRouter,
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
