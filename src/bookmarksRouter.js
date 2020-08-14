const express = require('express');
const { v4: uuid } = require('uuid');
const bookmarkRouter = express.Router();
const bookmarks = require('./bookmarks');
const logger = require('./logger');
const { PORT } = require('./config');

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.send('Hello, world!');
  });

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post((req, res) => {
    const { title, rating, URL, description } = req.body;
    if (!title) {
      logger.error('Title is required');
      return res.status(400).send('Title is require');
    }
    if (!rating) {
      logger.error('Rating is required');
      return res.status(400).send('Rating is require');
    }
    if (!URL) {
      logger.error('URL is required');
      return res.status(400).send('URL is require');
    }
    if (!description) {
      logger.error('Description is required');
      return res.status(400).send('Description is require');
    }

    const bookmark = {
      id: uuid(),
      title,
      rating,
      URL,
      description
    };

    bookmarks.push(bookmark);

    logger.info('Created new bookmark');
    res.status(201).location(`https://localhost:${PORT}/bookmarks/${bookmark.id}`);
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id = id);
    if (bookmarkIndex === -1) {
      return res.status(404).send('404 Not Found');
    }
    res.status(200).json(bookmarks[bookmarkIndex]);
  });

module.exports = bookmarkRouter;