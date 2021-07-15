const { spawn } = require('child_process');
const { join } = require('path');
const semverSatisfies = require('semver/functions/satisfies');

const { printError } = require('../messages');
const { writeFile } = require('../writeFile');

const spawnPublish = async ({ location, publishCommand }) => {
  const child = spawn('npm', [publishCommand], { cwd: location, shell: true });

  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  child.stderr.on('data', (err) => {
    process.stdout.write(err);
  });

  return await new Promise((resolve) => {
    child.on('exit', (code) => {
      if (code === 1) {
        printError();
        process.exit(1);
      }

      resolve(true);
    });
  });
};

exports.publish = async ({ locations, packageName, version, publishCommand }) => {
  for (const location of locations) {
    const packageJSONPath = join(location, 'package.json');
    const packageJSON = require(packageJSONPath);

    if (packageJSON.name === packageName) {
      packageJSON.version = version;

      await writeFile(packageJSONPath, packageJSON, { spaces: 2 });
      await spawnPublish({ location, publishCommand });

      continue;
    }

    if (
      packageJSON.devDependencies &&
      Object.keys(packageJSON.devDependencies).includes(packageName) &&
      !semverSatisfies(version, packageJSON.devDependencies[packageName])
    ) {
      packageJSON.devDependencies[packageName] = version;
    }

    if (
      packageJSON.peerDependencies &&
      Object.keys(packageJSON.peerDependencies).includes(packageName) &&
      !semverSatisfies(version, packageJSON.peerDependencies[packageName])
    ) {
      packageJSON.peerDependencies[packageName] = version;
    }

    if (
      packageJSON.dependencies &&
      Object.keys(packageJSON.dependencies).includes(packageName) &&
      !semverSatisfies(version, packageJSON.dependencies[packageName])
    ) {
      packageJSON.dependencies[packageName] = version;
    }

    await writeFile(packageJSONPath, packageJSON, { spaces: 2 });
  }
};
