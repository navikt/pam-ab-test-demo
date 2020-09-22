const setupHealthCheckEndpoints = (server) => {
  server.get(['/internal/isAlive', '/internal/isReady'], (req, res) => res.sendStatus(200));
};

module.exports = setupHealthCheckEndpoints;
