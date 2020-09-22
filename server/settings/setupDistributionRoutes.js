const path = require('path');
const express = require('express');
const unleash = require('./unleashSettings');
const distributionPaths = require('./distributionPaths');

const getCookie = (req, name) => {
  const re = new RegExp(`${name}=([^;]+)`);
  const match = re.exec(req.headers.cookie);
  return match !== null ? match[1] : '';
};

const userIsInTestGroup = (req) => req && req.headers.cookie && req.headers.cookie.includes('testGroup');

const userIsAssignedDist = (distName, res) => {
  const distEnabled = unleash.isEnabled(`pam-ab-test-demo.ab-test.${distName}`, {});
  if (distEnabled) {
    const twoWeeks = 604800000 * 2;
    res.cookie('testGroup', distName, { maxAge: twoWeeks });
  } else {
    const twoWeeks = 604800000 * 2;
    res.cookie('testGroup', 'master', { maxAge: twoWeeks });
  }
  return distEnabled;
};

const distributionIsEnabled = (distName) => unleash.isEnabled(`pam-ab-test-demo.ab-test.dist-${distName}`, {});

const setupDistributionRoutes = (server) => {
  server.use('/', express.static(path.resolve(__dirname, '../../dist')));
  server.use(['/'], (req, res) => {
    distributionPaths((distributions) => {
      distributions.map((dist) => {
        const distName = dist.split('/')[1];
        if (userIsInTestGroup(req)) {
          return res.sendFile(path.resolve(__dirname, `../../${getCookie(req, 'testGroup')}`, 'index.html'));
        }
        if (distributionIsEnabled(distName) && userIsAssignedDist(distName, res)) {
          return res.sendFile(path.resolve(__dirname, `../../${dist}`, 'index.html'));
        }
        return res.sendFile(path.resolve(__dirname, '../../dist/master', 'index.html'));
      });
    });
  });
};

module.exports = setupDistributionRoutes;
