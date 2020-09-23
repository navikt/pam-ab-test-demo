const { initialize } = require('unleash-client');

const unleash = initialize({
  url: 'https://unleash.nais.adeo.no/api/',
  appName: 'pam-ab-test-demo',
});

unleash.on('error', console.error);
unleash.on('warning', console.warn);
unleash.on('ready', console.info);

module.exports = unleash;
