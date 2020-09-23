const express = require('express');
const setupCertificates = require('./settings/setupCertificates');
const { configureDistributions } = require('./settings/configureDistributions');
const setupDistributionRoutes = require('./settings/setupDistributionRoutes');
const setupHealthCheckEndpoints = require('./settings/healthCheckEndpoints');
const { setupTestGroupInterceptor } = require('./settings/setupTestGroupInterceptor');

const PORT = process.env.PORT || 3000;
const server = express();

setupHealthCheckEndpoints(server);
setupTestGroupInterceptor(server);
setupCertificates();
configureDistributions();
setupDistributionRoutes(server);

// TODO - Setup amplitude endpoint.
server.post('/amplitude', (req, res) => {
  console.log(req, res);
});

server.listen(PORT, () => console.log(`Started serving on port ${PORT}`));
