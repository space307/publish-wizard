const { join } = require('path');

const { ACTIONS } = require('./constants');

const { getConfig } = require('./services/config');
const { getPackagesQueue, getSortedPackages } = require('./services/packages');
const { PUBLISHED_PACKAGES, BUMP_IN_SEQUENCE, print } = require('./messages');
const { publish } = require('./publish');

const { version: wispVersion } = require(join('..', 'package.json'));

(async () => {
  print.wispVersion(wispVersion);

  const config = getConfig();
  const sortedPackages = await getSortedPackages();
  const { wantBump } = await print.whatToBumpQuestion({ sortedPackages });
  const packagesQueue = getPackagesQueue({
    wantBump,
    sortedPackages,
  });
  const { action } = await print.actionQuestion({ actions: Object.values(ACTIONS) });

  switch (action) {
    case ACTIONS.SHOW_QUEUE:
      print.list({ title: BUMP_IN_SEQUENCE, list: Object.keys(packagesQueue) });
      break;

    case ACTIONS.PRE_RELEASE:
      print.list({
        title: PUBLISHED_PACKAGES,
        list: await publish({ queue: packagesQueue, config, action: ACTIONS.PRE_RELEASE }),
      });
      break;

    case ACTIONS.RELEASE:
      print.list({
        title: PUBLISHED_PACKAGES,
        list: await publish({ queue: packagesQueue, config, action: ACTIONS.RELEASE }),
      });
      break;
  }

  print.farewell();
  process.exit(0);
})();
