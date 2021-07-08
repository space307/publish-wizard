const inquirer = require('inquirer');
const { blue, green, cyan, yellow, red, bold } = require('kleur');
const emoji = require('node-emoji');

const ACTIONS = {
  PRE_RELEASE: 'Publish pre-release',
  SHOW_QUEUE: 'Show the queue to bump',
};

exports.askAboutAction = async () =>
  await inquirer.prompt([
    {
      type: 'list',
      message: 'Choose action',
      name: 'action',
      choices: Object.values(ACTIONS),
    },
  ]);

exports.askAboutNewVersion = async ({ availablePostfixes }) =>
  await inquirer.prompt([
    { type: 'list', message: 'Choose postfix', name: 'postfix', choices: availablePostfixes },
    { type: 'list', message: 'Choose extent of changes ', name: 'extent', choices: ['patch', 'minor', 'major'] },
  ]);

exports.askWhatToBump = async ({ sortedPackages }) =>
  await inquirer.prompt([
    {
      type: 'rawlist',
      message: 'Which package u want to bump?',
      name: 'wantBump',
      choices: sortedPackages.filter(({ private }) => !private).reverse(),
      pageSize: 8,
    },
  ]);

exports.confirmPublish = async ({ packageNewData, packageOldData }) =>
  await inquirer.prompt([
    {
      type: 'confirm',
      name: 'agreeToPublish',
      message: `${packageOldData} ${emoji.get('arrow_right')}  ${packageNewData}\n${yellow('Publish?')}`,
    },
  ]);

exports.farewell = () => process.stdout.write(`\n${emoji.get('wave')} Thank you, come again!\n`);

exports.notifyAboutNotStableVersion = ({ packageName }) =>
  process.stdout.write(
    `${emoji.get('thinking_face')} Looks like version of ${blue(packageName)} isn't stable. Upgraded the version.\n`,
  );

exports.printError = () => process.stdout.write(red(`${red('error')} Something went wrong. See output below.\n`));

exports.printPreparingToPublishHeading = ({ packageName }) =>
  process.stdout.write(
    `\n${emoji.get('package')} Preparing to publish a package: ${green().bold(`${packageName}`)}\n\n`,
  );

exports.printWispVersion = (wispVersion) =>
  process.stdout.write(`${cyan(`Publish Wizard v${wispVersion} ${emoji.get('sparkles')}`)}\n\n`);

exports.printList = ({ list, title }) => {
  process.stdout.write(green().bold(`${title}\n\n`));

  list.forEach((item, index) => {
    process.stdout.write(`${index + 1}. ${item}\n`);
  });
};

exports.notifyAboutPublishingInProgress = () => process.stdout.write(`\n${blue('info')} Publishing in progress\n`);
exports.notifyAboutSuccessPublishing = () => process.stdout.write(`\n${green('success')} Published\n`);

exports.notifyAboutSkipPublishPrivatePackage = ({ packageName }) =>
  process.stdout.write(`\n${blue('info')} Skip publishing of private package ${bold(packageName)}\n`);

exports.ACTIONS = ACTIONS;
