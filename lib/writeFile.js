const fs = require('fs/promises');

const stringify = (obj) => JSON.stringify(obj, null, 2).replace(/\n/g, EOL) + '\n';

exports.writeFile = async (path, data) => {
  return await fs.writeFile(path, stringify(data));
};
