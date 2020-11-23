const express = require('express');
const { initialize } = require('unleash-client');
const { createAbTestMiddleware } = require('ab-test-middleware');
const setupCertificates = require('./settings/setupCertificates');
const healthCheckMiddleware = require('./healthcheck-middleware/HealthCheckMiddleware');

if (process.env.NAIS_CLUSTER_NAME) {
  setupCertificates();
}

const PORT = process.env.PORT || 3000;
const app = express();

const unleash = initialize({
  url: 'http://localhost:4242/api/',
  appName: 'pam-ab-test-demo',
});

const distToggleInterpreter = (distName, ctx) => unleash.isEnabled(`pam-ab-test-demo.dist.${distName}`, ctx || {}, false);

const testToggleInterpreter = (distName, ctx) => unleash.isEnabled(`pam-ab-test-demo.ab-test.${distName}`, ctx || {}, false);

app.use(healthCheckMiddleware);
app.use(createAbTestMiddleware({
  defaultDist: 'master',
  distFolder: 'dist',
  cookieName: 'testGroup',
  entryFile: 'index.html',
  ingresses: ['/'],
  randomizeTestGroupDistribution: false,
  testGroupToggleInterpreter: testToggleInterpreter,
  distributionToggleInterpreter: distToggleInterpreter,
}));

app.listen(PORT, () => console.log(`Started serving on port ${PORT}`));
