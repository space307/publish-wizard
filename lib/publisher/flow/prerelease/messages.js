const { blue } = require('kleur');
const prompts = require('prompts');

const { onCancel } = require('../../../messages');

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

exports.notifyAboutNotStableVersion = ({ packageName }) =>
  process.stdout.write(
    `\uD83D\uDD0E Looks like the version of ${blue(packageName)} isn't stable. Upgraded the version.\n`,
  );
