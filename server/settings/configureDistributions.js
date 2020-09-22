const fs = require('fs');
const distributionPaths = require('./distributionPaths');

const moveDistributionImages = (distPath) => {
  try {
    fs.renameSync(`${distPath}/img`, 'dist/img');
  } catch {
    console.info(`No image directory for ${distPath}`);
  }
};

const rewriteFile = (distPath, data) => {
  const distFolder = distPath.split('/')[1];
  fs.writeFile(`${distPath}/index.html`,
    data.replace(new RegExp(`=/(?!${distFolder})`, 'g'), `=/${distFolder}/`),
    'utf-8',
    (e) => {
      if (e) console.error(e);
    });
};

const readIndexFile = (distPath, callback) => {
  fs.readFile(`${distPath}/index.html`,
    'utf-8',
    (err, data) => {
      if (err) console.error(err);
      callback(distPath, data);
    });
};

const configureDistributions = () => {
  distributionPaths((distributions) => {
    distributions.forEach((distPath) => {
      readIndexFile(distPath, rewriteFile);
      moveDistributionImages(distPath);
    });
  });
};

module.exports = configureDistributions;
