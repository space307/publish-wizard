const fs = require('fs/promises');

const stringify = (obj) => JSON.stringify(obj, null, 2).replace(/\n/g, '\n') + '\n';

exports.writeFile = async ({ path, data }) => await fs.writeFile(path, stringify(data));
