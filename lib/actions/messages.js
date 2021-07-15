const prompts = require('prompts');

const { onCancel } = reqlib('lib/messages');
const { ACTIONS } = require('./constants');

exports.actionQuestion = async () =>
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
