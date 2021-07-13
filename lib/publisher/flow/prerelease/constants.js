const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const RANDOM_POSTFIX = 'generate a random';
const POSTFIXES = {
  NEXT: {
    title: 'next',
    value: 'next',
  },
  ALPHA: {
    title: 'alpha',
    value: 'alpha',
  },
  BETA: {
    title: 'beta',
    value: 'beta',
  },
  NIGHTLY: {
    title: 'nightly',
    value: 'nightly',
  },
  RANDOM: {
    title: RANDOM_POSTFIX,
    value: RANDOM_POSTFIX,
    description: '"zkFezFfsHP" for example',
  },
};

exports.RANDOM_POSTFIX = RANDOM_POSTFIX;
exports.POSTFIXES = POSTFIXES;
exports.ALPHABET = ALPHABET;
