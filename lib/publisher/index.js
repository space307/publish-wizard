const { printError, notifyAboutSuccessPublishing, notifyAboutPublishingInProgress } = require('../messages');
const { prerelease } = require('./flow');
const { publish } = require('./publish');

exports.publisher = async ({ queue, config }) => {
  let result = [];

  const packagesLocations = Object.values(queue).map(({ location }) => location);

  for (const package of Object.entries(queue)) {
    const [name, { version, private }] = package;

    const prereleasePackageData = await prerelease({
      package: { name, version, private },
      postfixes: config.postfixes,
    });

    if (prereleasePackageData === null) {
      continue;
    }

    notifyAboutPublishingInProgress();

    try {
      await publish({
        packageName: prereleasePackageData.name,
        version: prereleasePackageData.version,
        locations: packagesLocations,
        publishCommand: config.publishCommand,
      });
      result = [...result, prereleasePackageData.packageNewData];
    } catch (e) {
      printError();
      process.stdout.write(e);
      process.exit(1);
    }

    notifyAboutSuccessPublishing();
  }

  return Promise.resolve(result);
};
