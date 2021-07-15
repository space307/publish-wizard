const { join } = require('path');

const { writeFile } = reqlib('lib/service/file');

const FILE_NAME = 'package.json.publish_wizard_backup';

// fixme: create after pre-release ended? or remove on cancel
exports.createBackup = async ({ packagesLocations }) => {
  for (const location of packagesLocations) {
    const { version, devDependencies, peerDependencies, dependencies, private, name } = require(join(
      location,
      'package.json',
    ));

    await writeFile({
      path: join(location, FILE_NAME),
      data: {
        description:
          "Don't delete the file. The wizard will need it for the release. After the release, the file will be deleted",
        name,
        version,
        private,
        dependencies,
        devDependencies,
        peerDependencies,
      },
    });
  }

  return Promise.resolve(true);
};
