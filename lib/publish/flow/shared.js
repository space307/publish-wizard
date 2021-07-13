exports.isStableVersion = (version) => /-/.exec(version) === null;
exports.joinVersionAndName = ({ name, version }) => `${name}@${version}`;
