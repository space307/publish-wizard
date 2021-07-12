const { join } = require('path');

const DEFAULT_CONFIG = {
  postfixes: [],
  publishCommand: 'publish',
};

const isEmptyConfig = (config) => Object.values(config).length === 0;
const isString = (x) => typeof x === 'string';

const parseConfig = ({ data }) => {
  if (typeof data !== 'object' || Array.isArray(data) || data === null) {
    return {};
  }

  const { publishCommand, postfixes } = data;

  return {
    publishCommand: isString(publishCommand) ? publishCommand : DEFAULT_CONFIG.publishCommand,
    postfixes: Array.isArray(postfixes) ? postfixes.filter(isString) : DEFAULT_CONFIG.postfixes,
  };
};

const readConfig = ({ path, lens }) => {
  try {
    const data = require(path);

    return parseConfig({ data: lens(data) });
  } catch (e) {
    return {};
  }
};

exports.getConfig = () => {
  const rootPath = process.cwd();

  const configFromConfigFile = readConfig({ path: join(rootPath, '.publish-wizard.json'), lens: (x) => x });

  if (!isEmptyConfig(configFromConfigFile)) {
    return configFromConfigFile;
  }

  const configFromPackageJSON = readConfig({ path: join(rootPath, 'package.json'), lens: (x) => x['publish-wizard'] });

  if (!isEmptyConfig(configFromPackageJSON)) {
    return configFromPackageJSON;
  }

  return {
    postfixes: [],
    publishCommand: 'publish',
  };
};
