// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    files: [
      "../test/index.ts"
    ],
    preprocessors: {
      "../test/index.ts": ["webpack"],
    },
    mime: {
      "text/x-typescript": ["ts"],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
  });
};
