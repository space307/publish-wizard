const { join } = require('path');

const { ACTIONS } = require('./constants');
const { getConfig } = require('./getConfig');
const { getPackagesQueue } = require('./getPackagesQueue');
const { getSortedPackages } = require('./getSortedPackages');
const {
  printWispVersion,
  askWhatToBump,
  askAboutAction,
  printList,
  farewell,
  PUBLISHED_PACKAGES,
  BUMP_IN_SEQUENCE,
} = require('./messages');
const { publish } = require('./publish');

const { version: wispVersion } = require(join('..', 'package.json'));

(async () => {
  printWispVersion(wispVersion);

  const config = getConfig();
  const sortedPackages = await getSortedPackages();
  const { wantBump } = await askWhatToBump({ sortedPackages });
  const packagesQueue = getPackagesQueue({
    wantBump,
    sortedPackages,
  });
  const { action } = await askAboutAction();

  switch (action) {
    case ACTIONS.SHOW_QUEUE:
      printList({ title: BUMP_IN_SEQUENCE, list: Object.keys(packagesQueue) });
      break;

    case ACTIONS.PRE_RELEASE:
      printList({
        title: PUBLISHED_PACKAGES,
        list: await publish({ queue: packagesQueue, config, action: ACTIONS.PRE_RELEASE }),
      });
      break;

    case ACTIONS.RELEASE:
      printList({
        title: PUBLISHED_PACKAGES,
        list: await publish({ queue: packagesQueue, config, action: ACTIONS.RELEASE }),
      });
      break;
  }

  farewell();
  process.exit(0);
})();
