const fs = require('fs/promises');

const stringify = (obj, { EOL = '\n', finalEOL = true, replacer = null, spaces = 2 } = {}) => {
  const EOF = finalEOL ? EOL : '';
  const str = JSON.stringify(obj, replacer, spaces);

  return str.replace(/\n/g, EOL) + EOF;
};

exports.writeFile = async (path, data) => {
  return await fs.writeFile(path, stringify(data));
};
