const express = require('express');

const DEFAULT_PATHS = ['/internal/isAlive', '/internal/isReady'];
const createHealthCheckMiddleware = (options) => {
  const paths = options ? options.paths || DEFAULT_PATHS : DEFAULT_PATHS;
  const router = express.Router();
  router.get(paths, (req, res) => res.sendStatus(200));
  return router;
};

module.exports = createHealthCheckMiddleware();
