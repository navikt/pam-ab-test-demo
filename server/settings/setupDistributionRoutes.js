const path = require('path');
const express = require('express');
const { distributionPaths } = require('./configureDistributions');
const { userTestGroup } = require('./setupTestGroupInterceptor');

const setupDistributionRoutes = (server) => {
  const paths = distributionPaths().map((it) => it.split('/')[1]);
  server.use(paths, (p) => express.static(path.resolve(__dirname, `../../dist/${p}/img`)));
  server.use(['/'], (req, res) => {
    const testGroup = userTestGroup(req);
    if (testGroup && paths.includes(testGroup)) {
      return res.sendFile(path.resolve(__dirname, `../../dist/${testGroup}`, 'index.html'));
    }
    return res.sendFile(path.resolve(__dirname, '../../dist/master', 'index.html'));
  });
};

module.exports = setupDistributionRoutes;
