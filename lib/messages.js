const { blue, green, cyan, yellow, red, bold } = require('kleur');
const prompts = require('prompts');

const { ACTIONS } = require('./constants');

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

exports.farewell = farewell;
exports.onCancel = onCancel;
