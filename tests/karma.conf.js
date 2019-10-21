module.exports = function(config) {
  config.set({
    frameworks: ['qunit'],
    basePath: '.',
    files: [
      '../node_modules/core-js/client/core.js',
      '../index.js',
      '../tests/tests.js'
    ],
    singleRun: false,
  });
};
