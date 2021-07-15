const { green, cyan, red } = require('kleur');
const prompts = require('prompts');

const farewell = () => process.stdout.write(`\n\ud83d\udc4b Thank you, come again!\n`);
const onCancel = () => {
  farewell();
  process.exit(0);
};

const whatToBumpQuestion = async ({ sortedPackages }) =>
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

const error = () => process.stdout.write(red(`${red('error')} Something went wrong. See the output below.\n`));
const wispVersion = (wispVersion) => process.stdout.write(`${cyan(`Publish Wizard v${wispVersion} \u2728`)}\n\n`);
const list = ({ list, title }) => {
  process.stdout.write(green().bold(`${title}\n\n`));

  list.forEach((item, index) => {
    process.stdout.write(`${index + 1}. ${item}\n`);
  });
};

exports.onCancel = onCancel;
exports.PUBLISHED_PACKAGES = '\nPublished packages:';
exports.BUMP_IN_SEQUENCE = '\nBump packages in a sequence:';

exports.print = {
  whatToBumpQuestion,
  error,
  farewell,
  wispVersion,
  list,
};
