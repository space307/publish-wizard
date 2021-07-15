global.reqlib = require('app-root-path').require;

const { ACTIONS, actionQuestion } = reqlib('lib/actions');
const { getConfig } = reqlib('lib/service/config');
const { getPackagesQueue, getSortedPackages } = reqlib('lib/service/package');
const { PUBLISHED_PACKAGES, BUMP_IN_SEQUENCE, print } = reqlib('lib/messages');
const { publish } = reqlib('lib/publish');

(async () => {
  print.wispVersion();

  const config = getConfig();
  const sortedPackages = await getSortedPackages();

  const { wantBump } = await print.whatToBumpQuestion({ sortedPackages });
  const { action } = await actionQuestion();

  const packagesQueue = getPackagesQueue({
    wantBump,
    sortedPackages,
  });

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
