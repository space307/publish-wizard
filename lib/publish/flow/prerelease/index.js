const { print } = reqlib('lib/messages');
const { joinNameWithVersion } = reqlib('lib/service/packages');
const { confirmPublish, preparingToPublish } = require('../shared');
const { retrieveNextVersion } = require('./retrieveNextVersion');

exports.prerelease = async ({ package: { name, version }, tags }) => {
  preparingToPublish({ packageName: name });

  const publicationVersion = await retrieveNextVersion({
    version,
    packageName: name,
    customTags: tags,
  });

  const packageNewData = joinNameWithVersion({ name, version: publicationVersion });
  const { agreeToPublish } = await confirmPublish({
    packageNewData,
    packageOldData: joinNameWithVersion({ name, version }),
  });

  if (!agreeToPublish) {
    print.farewell();
    process.exit(0);
  }

  return Promise.resolve({ name, version: publicationVersion, userOutputData: packageNewData });
};
