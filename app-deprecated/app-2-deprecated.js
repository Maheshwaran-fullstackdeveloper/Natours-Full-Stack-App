const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');

// Middleware for setting security HTTP headers
app.use(helmet());

// Middleware for rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // Milliseconds in 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); // Apply rate limiting only to routes that start with /api

// Middleware for logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Middleware for reading JSON data from body into req.body
app.use(express.json());
//app.use(express.json({ limit: '10kb' })); // Body size limit 10kb

// Middleware order matters as we sanitize after reading data from body and also for xss
// Data sanitization against NoSQL query injection ("email": { "$gt": "" } - This will always return true and login with user who appears alphabetically first and also with common passwords)
app.use(mongoSanitize());

// Data sanitization against XSS(Cross Site Scripting) attacks
app.use(xss()); // Cleans any HTML malicious code from user input like <script></script>
// Attacker can embedd JS scripts in HTML codes which results in attacks and security breach

//app.use(hpp()); // Prevent HTTP parameter pollution by removiong duplicate query parameters in URL query string

// Prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// Example: ?duration=5&duration=9
// Removes duplicate query parameters in URL query string except the whitelisted ones

// Middleware for serving static files
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
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error); // Re-routes to the error handling middleware
});

app.use(globalErrorHandler); // Global error handling middleware

module.exports = app;
