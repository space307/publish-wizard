const { customAlphabet } = require('nanoid');
const semverInc = require('semver/functions/inc');

const {
  farewell,
  printPreparingToPublishHeading,
  confirmPublish,
  askAboutNewVersion,
  notifyAboutSkipPublishPrivatePackage,
  notifyAboutNotStableVersion,
  printError,
  notifyAboutPublishingInProgress,
  notifyAboutSuccessPublishing,
} = require('../messages');
const { publish } = require('./publish');

const RANDOM_POSTFIX = 'generate random';
const POSTFIXES = {
  NEXT: {
    title: 'next',
    value: 'next',
  },
  ALPHA: {
    title: 'alpha',
    value: 'alpha',
  },
  BETA: {
    title: 'beta',
    value: 'beta',
  },
  NIGHTLY: {
    title: 'nightly',
    value: 'nightly',
  },
  RANDOM: {
    title: RANDOM_POSTFIX,
    value: RANDOM_POSTFIX,
    description: '"zkFezFfsHP" for example',
  },
};
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const isStableVersion = (version) => /-/.exec(version) === null;

const retrieveNextVersion = async ({ version, packageName, customPostfixes }) => {
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

const joinVersionAndName = ({ name, version }) => `${name}@${version}`;

exports.publisher = async ({ queue, config }) => {
  let result = [];

  const packagesLocations = Object.values(queue).map(({ location }) => location);

  for (const package of Object.entries(queue)) {
    const [name, { version, private }] = package;

    if (private) {
      notifyAboutSkipPublishPrivatePackage({ packageName: name });
      continue;
    }

    printPreparingToPublishHeading({ packageName: name });

    const publicationVersion = await retrieveNextVersion({
      version,
      packageName: name,
      customPostfixes: config.postfixes,
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

    notifyAboutPublishingInProgress();

    try {
      await publish({
        packageName: name,
        version: publicationVersion,
        locations: packagesLocations,
        publishCommand: config.publishCommand,
      });
      result = [...result, packageNewData];
    } catch (e) {
      printError();
      process.stdout.write(e);
      process.exit(1);
    }

    notifyAboutSuccessPublishing();
  }

  return Promise.resolve(result);
};
