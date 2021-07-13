const semverInc = require('semver/functions/inc');
const semverCoerce = require('semver/functions/coerce');

const { askAboutExtent, isStableVersion } = require('../shared');

const retrieveNewVersion = async ({ version }) => {
  if (isStableVersion(version)) {
    const { extent } = await askAboutExtent();

    return semverInc(version, extent);
  }

  return semverCoerce(version).version;
};

exports.release = async ({ package: { name, version } }) => {
  const newVersion = await retrieveNewVersion({ version });

  process.stdout.write(`${version} ===> ${newVersion} \n`);
  process.exit(0);
  // if is unstable -- clear
  // if is stable -- ask about extent
};
