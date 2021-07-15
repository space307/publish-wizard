const { customAlphabet } = require('nanoid');
const semverInc = require('semver/functions/inc');

const { isStableVersion } = reqlib('lib/service/packages');
const { askAboutExtent } = require('../shared');
const { RANDOM_TAG, TAGS, ALPHABET } = require('./constants');
const { askAboutTag, notifyAboutNotStableVersion } = require('./messages');

exports.retrieveNextVersion = async ({ version, packageName, customTags }) => {
  if (!isStableVersion(version)) {
    notifyAboutNotStableVersion({ packageName });

    return semverInc(version, 'prerelease');
  }

  const parsedCustomTags = customTags.reduce((acc, tag) => ({ ...acc, [tag]: { title: tag, value: tag } }), {});
  const { tag } = await askAboutTag({ availableTags: { ...parsedCustomTags, ...TAGS } });
  const { extent } = await askAboutExtent();

  return semverInc(version, `pre${extent}`, tag === RANDOM_TAG ? customAlphabet(ALPHABET, 10)() : tag);
};
