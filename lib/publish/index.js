const { ACTIONS } = reqlib('lib/constants');
const { print } = reqlib('lib/messages');
// const { createBackup } = reqlib('service/packages');
const { prerelease, release } = require('./flow');
const {
  notifyAboutSuccessPublishing,
  notifyAboutPublishingInProgress,
  notifyAboutSkipPublishPrivatePackage,
} = require('./messages');
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

  print.error();
  process.exit(1);
};

exports.publish = async ({ queue, config, action }) => {
  const packagesLocations = Object.values(queue).map(({ location }) => location);

  // if (action === ACTIONS.PRE_RELEASE) {
  //  await createBackup({ packagesLocations });
  // }

  return await Object.entries(queue).reduce(async (promisedAcc, [name, { version, private }]) => {
    const acc = await promisedAcc;

    if (private) {
      notifyAboutSkipPublishPrivatePackage({ packageName: name });
      return acc;
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
    } catch (e) {
      print.error();
      process.stdout.write(e);
      process.exit(1);
    }

    notifyAboutSuccessPublishing();

    return [...acc, releaseData.userOutputData];
  }, Promise.resolve([]));
};
