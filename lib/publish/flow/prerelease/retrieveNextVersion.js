const { customAlphabet } = require('nanoid');
const semverInc = require('semver/functions/inc');

const { isStableVersion } = require('../shared');
const { RANDOM_POSTFIX, POSTFIXES, ALPHABET } = require('./constants');
const { askAboutNewVersion, notifyAboutNotStableVersion } = require('./messages');

exports.retrieveNextVersion = async ({ version, packageName, customPostfixes }) => {
  if (!isStableVersion(version)) {
    notifyAboutNotStableVersion({ packageName });

    return semverInc(version, 'prerelease');
  }

  const parsedCustomPostfixes = customPostfixes.reduce(
    (acc, post) => ({ ...acc, [post]: { title: post, value: post } }),
    {},
  );

  const { extent, postfix } = await askAboutNewVersion({
    availablePostfixes: { ...parsedCustomPostfixes, ...POSTFIXES },
  });

  return semverInc(version, `pre${extent}`, postfix === RANDOM_POSTFIX ? customAlphabet(ALPHABET, 10)() : postfix);
};
