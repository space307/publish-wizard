const { blue } = require('kleur');
const prompts = require('prompts');

const { onCancel } = reqlib('lib/messages');

exports.askAboutTag = async ({ availableTags }) =>
  await prompts(
    [
      {
        type: 'select',
        message: 'Select the prerelease tag',
        name: 'tag',
        choices: Object.values(availableTags),
      },
    ],
    { onCancel },
  );

exports.notifyAboutNotStableVersion = ({ packageName }) =>
  process.stdout.write(
    `\uD83D\uDD0E Looks like the version of ${blue(packageName)} isn't stable. Upgraded the version.\n`,
  );
