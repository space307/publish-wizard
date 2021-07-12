const { blue, green, cyan, yellow, red, bold } = require('kleur');
const prompts = require('prompts');

const ACTIONS = {
  PRE_RELEASE: 'Publish the prerelease',
  SHOW_QUEUE: 'Show the queue to bump',
};

const farewell = () => process.stdout.write(`\n\ud83d\udc4b Thank you, come again!\n`);

const onCancel = () => {
  farewell();
  process.exit(0);
};

exports.askAboutAction = async () =>
  await prompts(
    [
      {
        type: 'select',
        message: 'Select the action',
        name: 'action',
        choices: Object.values(ACTIONS).map((action) => ({ title: action, value: action })),
      },
    ],
    { onCancel },
  );

exports.askAboutNewVersion = async ({ availablePostfixes }) =>
  await prompts(
    [
      {
        type: 'select',
        message: 'Select the postfix',
        name: 'postfix',
        choices: Object.values(availablePostfixes),
      },
      {
        type: 'select',
        message: 'Select the extent of changes',
        name: 'extent',
        choices: [
          { title: 'patch', value: 'patch' },
          { title: 'minor', value: 'minor' },
          { title: 'major', value: 'major' },
        ],
      },
    ],
    { onCancel },
  );

exports.askWhatToBump = async ({ sortedPackages }) =>
  await prompts(
    [
      {
        type: 'select',
        message: 'Select the package u want to bump',
        name: 'wantBump',
        choices: sortedPackages
          .reduce((acc, { name, private }) => (private ? acc : [...acc, { title: name, value: name }]), [])
          .reverse(),
      },
    ],
    { onCancel },
  );

exports.confirmPublish = async ({ packageNewData, packageOldData }) =>
  await prompts(
    [
      {
        type: 'confirm',
        name: 'agreeToPublish',
        message: `${packageOldData} \ud83d\udc49 ${packageNewData}\n${yellow('  Publish?')}`,
        initial: true,
      },
    ],
    { onCancel },
  );

exports.notifyAboutNotStableVersion = ({ packageName }) =>
  process.stdout.write(
    `\uD83D\uDD0E Looks like the version of ${blue(packageName)} isn't stable. Upgraded the version.\n`,
  );

exports.printError = () => process.stdout.write(red(`${red('error')} Something went wrong. See the output below.\n`));

exports.printPreparingToPublishHeading = ({ packageName }) =>
  process.stdout.write(`\n\ud83c\udf73 Preparing to publish a package: ${green().bold(`${packageName}`)}\n\n`);

exports.printWispVersion = (wispVersion) =>
  process.stdout.write(`${cyan(`Publish Wizard v${wispVersion} \u2728`)}\n\n`);

exports.printList = ({ list, title }) => {
  process.stdout.write(green().bold(`${title}\n\n`));

  list.forEach((item, index) => {
    process.stdout.write(`${index + 1}. ${item}\n`);
  });
};

exports.notifyAboutPublishingInProgress = () => process.stdout.write(`\n${blue('info')} Publishing in progress\n`);
exports.notifyAboutSuccessPublishing = () => process.stdout.write(`\n${green('success')} Published\n`);

exports.notifyAboutSkipPublishPrivatePackage = ({ packageName }) =>
  process.stdout.write(`\n${blue('info')} Skip publishing of a private package ${bold(packageName)}\n`);

exports.ACTIONS = ACTIONS;
exports.farewell = farewell;
