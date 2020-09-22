const { initialize } = require('unleash-client');

const setupUnleash = () => initialize({
  url: 'https://unleashproxy.nais.oera.no/api/',
  appName: 'pam-ab-test-demo',
});

module.exports = setupUnleash();
