const path = require('path');
const express = require('express');
const { userTestGroup } = require('./setupTestGroupInterceptor');

const setupDistributionRoutes = (server) => {
  server.use('/', express.static(path.resolve(__dirname, '../../dist')));
  server.use(['/'], (req, res) => {
    const testGroup = userTestGroup(req);
    if (testGroup) {
      return res.sendFile(path.resolve(__dirname, `../../dist/${testGroup}`, 'index.html'));
    }
    return res.sendFile(path.resolve(__dirname, '../../dist/master', 'index.html'));
  });
};

module.exports = setupDistributionRoutes;
