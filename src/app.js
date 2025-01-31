require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {  NODE_ENV } = require('./config');
const logger = require('./logger');
const bookmarksRouter = require('./bookmarksRouter');
const app = express();

const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Cha Cha real smooth back to the right path: ${req.path}`);
    return res.status(401).json({
      error: 'You probably were not going to read this book. Try again, buddy'
    });
  }
  next();
});

app.use(bookmarksRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = {
      error: {
        message: 'server error'
      }
    };
  } else {
    logger.error(error.message);
    response = {
      message: error.message,
      error
    };
  }
  res.status(500).json(response);
  next();
});

module.exports = app;