const prompts = require('prompts');

const { onCancel } = require('../../messages');

exports.isStableVersion = (version) => /-/.exec(version) === null;
exports.joinVersionAndName = ({ name, version }) => `${name}@${version}`;
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
