const { printPreparingToPublishHeading, confirmPublish, farewell } = require('../../../messages');
const { joinVersionAndName } = require('../shared');
const { retrieveNextVersion } = require('./retrieveNextVersion');

exports.prerelease = async ({ package: { name, version }, postfixes }) => {
  printPreparingToPublishHeading({ packageName: name });

  const publicationVersion = await retrieveNextVersion({
    version,
    packageName: name,
    customPostfixes: postfixes,
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
