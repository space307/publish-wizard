const { promisify } = require('util');

const exec = promisify(require('child_process').exec);

exports.getSortedPackages = async () => {
  const { stdout } = await exec('npx lerna ls --toposort --json --all');

  return Object.values(JSON.parse(stdout));
};
