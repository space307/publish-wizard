const { yellow, green } = require('kleur');
const prompts = require('prompts');

const { onCancel } = reqlib('lib/messages');

exports.askAboutExtent = async () =>
  await prompts(
    [
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
exports.preparingToPublish = ({ packageName }) =>
  process.stdout.write(`\n\ud83c\udf73 Preparing to publish a package: ${green().bold(`${packageName}`)}\n\n`);
