const { printPreparingToPublishHeading, farewell } = require('../../../messages');
const { joinVersionAndName, confirmPublish } = require('../shared');
const { retrieveNextVersion } = require('./retrieveNextVersion');

exports.prerelease = async ({ package: { name, version }, tags }) => {
  printPreparingToPublishHeading({ packageName: name });

  const publicationVersion = await retrieveNextVersion({
    version,
    packageName: name,
    customTags: tags,
  });

  const packageNewData = joinVersionAndName({ name, version: publicationVersion });
  const { agreeToPublish } = await confirmPublish({
    packageNewData,
    packageOldData: joinVersionAndName({ name, version }),
  });

  if (!agreeToPublish) {
    farewell();
    process.exit(0);
  }

  return Promise.resolve({ name, version: publicationVersion, userOutputData: packageNewData });
};
