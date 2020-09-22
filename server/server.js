const express = require('express');
const configureDistributions = require('./settings/configureDistributions');
const setupDistributionRoutes = require('./settings/setupDistributionRoutes');
const setupHealthCheckEndpoints = require('./settings/healthCheckEndpoints');

const PORT = process.env.PORT || 3000;

const server = express();

configureDistributions();
setupDistributionRoutes(server);
setupHealthCheckEndpoints(server);

server.post('/amplitude', (req, res) => {
  console.log(req, res);
});



server.listen(PORT, () => console.log(`Started serving on port ${PORT}`));
