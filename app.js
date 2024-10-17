var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const mongoString = process.env.DATABASE_URL

var portfolioRouter = require('./routes/portfolio');

var app = express();

const secret = process.env.SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/portfolio', portfolioRouter);

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

//N83asYeMDKsq7yEA

module.exports = app;
