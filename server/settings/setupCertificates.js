const setupCertificates = () => {
  if (process.env.NAIS_NAMESPACE) {
    // eslint-disable-next-line global-require
    require('ssl-root-cas')
      .addFile('/etc/pki/tls/certs/ca-bundle.crt')
      .addFile('/etc/ssl/certs/ca-certificates.crt');
  }
};

module.exports = setupCertificates;
