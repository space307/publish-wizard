const { join } = require('path');

const { getConfig } = require('./getConfig');
const { getPackagesQueue } = require('./getPackagesQueue');
const { getSortedPackages } = require('./getSortedPackages');
const { printWispVersion, askWhatToBump, askAboutAction, printList, farewell, ACTIONS } = require('./messages');
const { publisher } = require('./publisher');

const packageJSONPath = join('..', 'package.json');
const { version: wispVersion } = require(packageJSONPath);

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
      printList({ title: '\nBump packages in a sequence:', list: Object.keys(packagesQueue) });
      break;

    case ACTIONS.PRE_RELEASE:
      printList({ title: '\nPublished packages:', list: await publisher({ queue: packagesQueue, config }) });
      break;
  }

  farewell();
  process.exit(0);
})();
