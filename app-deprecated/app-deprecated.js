const express = require('express');
const app = express();
const morgan = require('morgan');

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

// Middleware for logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Middleware for parsing JSON bodies
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// Middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Middleware for Routes
//Mounting the routers
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

//Handling unhandles routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
});

module.exports = app;
