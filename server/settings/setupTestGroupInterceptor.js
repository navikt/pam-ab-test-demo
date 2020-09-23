const unleash = require('./unleashSettings');
const { distributionPaths } = require('./configureDistributions');

const twoWeeks = 604800000 * 2;

const getCookie = (req, name) => {
  const re = new RegExp(`${name}=([^;]+)`);
  const match = re.exec(req.headers.cookie);
  return match !== null ? match[1] : '';
};

const distributionIsEnabled = (distName) => unleash.isEnabled(`pam-ab-test-demo.ab-test.dist-${distName}`, {});
const userIsInTestGroup = (req) => req && req.headers.cookie && req.headers.cookie.includes('testGroup');

const userTestGroup = (req) => (req && req.headers.cookie ? getCookie(req, 'testGroup') : undefined);

const assignUserTestGroup = (distName, res) => {
  const shouldAssignUserTestGroup = unleash.isEnabled(`pam-ab-test-demo.ab-test.${distName}`, {});
  if (shouldAssignUserTestGroup) {
    res.cookie('testGroup', distName, { maxAge: twoWeeks });
  }
  return shouldAssignUserTestGroup;
};

const setupTestGroupInterceptor = (server) => {
  server.use((req, res, next) => {
    if (req.path.includes('internal')) {
      return next();
    }
    if (!userIsInTestGroup(req)) {
      let testGroupAssigned;
      distributionPaths().forEach((dist) => {
        const distName = dist.split('/')[1];
        if (distributionIsEnabled(distName) && !testGroupAssigned) {
          testGroupAssigned = assignUserTestGroup(distName, res);
        }
      });
      if (!testGroupAssigned) {
        res.cookie('testGroup', 'master', { maxAge: twoWeeks });
      }
    }
    // TODO - Disable distribution based on unleash toggle
    return next();
  });
};

module.exports = {
  userIsInTestGroup,
  userTestGroup,
  getCookie,
  setupTestGroupInterceptor,
};
