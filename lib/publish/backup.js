const { join } = require('path');

const { writeFile } = require('../writeFile');

const FILE_NAME = 'package.json.publish_wizard_backup';

exports.createBackup = async ({ packagesLocations }) => {
  for (const location of packagesLocations) {
    const { version, devDependencies, peerDependencies, dependencies, private, name } = require(join(
      location,
      'package.json',
    ));

    await writeFile(join(location, FILE_NAME), {
      description:
        "Don't delete the file. The wizard will need it for the release. After the release, the file will be deleted",
      name,
      version,
      private,
      dependencies,
      devDependencies,
      peerDependencies,
    });
  }

  return Promise.resolve(true);
};
