const { spawn } = require('child_process');
const { join } = require('path');

const { printError } = require('../messages');
const { writeFile } = require('../writeFile');

const spawnPublish = async ({ location }) => {
  const child = spawn('npm', ['publish'], { cwd: location, shell: true });

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

exports.publish = async ({ locations, packageName, version }) => {
  for (const location of locations) {
    const packageJSONPath = join(location, 'package.json');
    const packageJSON = require(packageJSONPath);

    if (packageJSON.name === packageName) {
      packageJSON.version = version;

      await writeFile(packageJSONPath, packageJSON, { spaces: 2 });
      await spawnPublish({ location });

      continue;
    }

    if (packageJSON.devDependencies && Object.keys(packageJSON.devDependencies).includes(packageName)) {
      packageJSON.devDependencies[packageName] = version;
    }

    if (packageJSON.peerDependencies && Object.keys(packageJSON.peerDependencies).includes(packageName)) {
      packageJSON.peerDependencies[packageName] = version;
    }

    if (packageJSON.dependencies && Object.keys(packageJSON.dependencies).includes(packageName)) {
      packageJSON.dependencies[packageName] = version;
    }

    await writeFile(packageJSONPath, packageJSON, { spaces: 2 });
  }
};
