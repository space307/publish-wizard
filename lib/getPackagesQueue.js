const { join } = require('path');

const getPackageDependencies = (package) => {
  const packageJSONLocation = join(package.location, 'package.json');
  const { peerDependencies, dependencies, devDependencies } = require(packageJSONLocation);

  return { ...peerDependencies, ...dependencies, ...devDependencies };
};

const shouldBumpPackage = ({ verifiablePackage, wantUpdate }) => {
  const packageDependencies = getPackageDependencies(verifiablePackage);

  return Object.keys(packageDependencies).includes(wantUpdate);
};

const getPackagesToUpdate = ({ wantUpdate, packagesList, result }) => {
  const list = packagesList.reduce(
    (acc, item) => (shouldBumpPackage({ verifiablePackage: item, wantUpdate }) ? [...acc, item.name] : acc),
    [],
  );

  if (list.length === 0) {
    return result;
  }

  result[wantUpdate] = list;

  list.forEach((item) => {
    getPackagesToUpdate({ wantUpdate: item, packagesList, result });
  });

  return result;
};

exports.getPackagesQueue = ({ wantBump, sortedPackages }) => {
  const packagesToUpdate = getPackagesToUpdate({
    wantUpdate: wantBump,
    packagesList: sortedPackages,
    result: {},
  });

  const listWithoutDuplicates = [
    ...new Set(Object.values(packagesToUpdate).reduce((acc, item) => [...acc, ...item], [])),
  ];

  return sortedPackages.reduce(
    (acc, { name, ...rest }) => ([wantBump, ...listWithoutDuplicates].includes(name) ? { ...acc, [name]: rest } : acc),
    {},
  );
};
