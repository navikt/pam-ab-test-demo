const fs = require('fs');
const path = require('path');

const distributionPaths = (resolve) => {
  const distPath = './dist';
  return fs.readdir(distPath, (err, files) => {
    if (err) console.error(err);
    resolve(files.map((f) => path.join(distPath, f))
      .filter((f) => fs.statSync(f).isDirectory() && !f.includes('img')));
  });
};

module.exports = distributionPaths;
