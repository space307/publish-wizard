const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const RANDOM_TAG = 'generate a random';
const TAGS = {
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
    title: RANDOM_TAG,
    value: RANDOM_TAG,
    description: '"zkFezFfsHP" for example',
  },
};

exports.RANDOM_TAG = RANDOM_TAG;
exports.TAGS = TAGS;
exports.ALPHABET = ALPHABET;
