const fs = require('fs');
const path = require('path');

let paths;

const distributionPaths = () => {
  if (paths) return paths;
  const distPath = './dist';
  paths = fs.readdirSync(distPath)
    .map((f) => path.join(distPath, f))
    .filter((f) => fs.statSync(f).isDirectory() && !f.includes('img'));
  return paths;
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
  distributionPaths().forEach((distPath) => {
    readIndexFile(distPath, rewriteFile);
  });
};

module.exports = {
  configureDistributions,
  distributionPaths,
};
