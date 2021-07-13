const { ACTIONS } = require('../constants');
const {
  printError,
  notifyAboutSuccessPublishing,
  notifyAboutPublishingInProgress,
  notifyAboutSkipPublishPrivatePackage,
  farewell,
} = require('../messages');
const { prerelease, release } = require('./flow');
const { publish } = require('./publish');

const getReleaseData = async ({ action, package, tags }) => {
  if (action === ACTIONS.PRE_RELEASE) {
    return await prerelease({
      package,
      tags,
    });
  }

  if (action === ACTIONS.RELEASE) {
    return await release({ package });
  }

  printError();
  process.exit(1);
};

exports.publish = async ({ queue, config, action }) => {
  // todo: avoid mutations
  let result = [];

  const packagesLocations = Object.values(queue).map(({ location }) => location);

  for (const [name, { version, private }] of Object.entries(queue)) {
    if (private) {
      notifyAboutSkipPublishPrivatePackage({ packageName: name });
      continue;
    }

    const releaseData = await getReleaseData({
      package: { name, version },
      tags: config.tags,
      action,
    });

    notifyAboutPublishingInProgress();

    try {
      await publish({
        packageName: releaseData.name,
        version: releaseData.version,
        locations: packagesLocations,
        publishCommand: config.publishCommand,
      });
      result = [...result, releaseData.userOutputData];
    } catch (e) {
      printError();
      process.stdout.write(e);
      process.exit(1);
    }

    notifyAboutSuccessPublishing();
  }

  return Promise.resolve(result);
};