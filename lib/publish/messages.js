const { blue, green, bold } = require('kleur');

exports.notifyAboutSuccessPublishing = () => process.stdout.write(`\n${green('success')} Published\n`);
exports.notifyAboutPublishingInProgress = () => process.stdout.write(`\n${blue('info')} Publishing in progress\n`);
exports.notifyAboutSkipPublishPrivatePackage = ({ packageName }) =>
  process.stdout.write(`\n${blue('info')} Skip publishing of a private package ${bold(packageName)}\n`);
