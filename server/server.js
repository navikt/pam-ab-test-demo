const express = require('express');
const { initialize } = require('unleash-client');
const setupCertificates = require('./settings/setupCertificates');
const healthCheckMiddleware = require('./healthcheck-middleware/HealthCheckMiddleware');
const { createAbTestMiddleware } = require('./ab-test-middleware');

setupCertificates();

const PORT = process.env.PORT || 3000;
const server = express();

const unleash = initialize({
  url: 'https://unleash.nais.adeo.no/api/',
  appName: 'pam-ab-test-demo',
});

const toggleInterpreter = (distName, ctx) => unleash.isEnabled(`pam-ab-test-demo.dist.${distName}`, {} || ctx, false);
const tgToggleInterpreter = (distName, ctx) => unleash.isEnabled(`pam-ab-test-demo.dist.${distName}.group`, ctx || {}, false);

server.use(healthCheckMiddleware);
server.use(createAbTestMiddleware({
  defaultDist: 'master',
  distFolder: 'dist',
  cookieName: 'testGroup',
  entryFile: 'index.html',
  testGroupToggleInterpreter: tgToggleInterpreter,
  distributionToggleInterpreter: toggleInterpreter,
}));

// TODO - Setup amplitude endpoint.
server.post('/amplitude', (req, res) => {
  console.log(req, res);
});

server.listen(PORT, () => console.log(`Started serving on port ${PORT}`));
