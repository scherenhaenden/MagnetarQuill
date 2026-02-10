// karma.conf.js
const glob = require('glob');

module.exports = function (config) {
  // 1) Busca dinámicamente todos los test.ts en proyectos
  const projectTestEntrypoints = glob
    .sync('projects/**/src/test.ts')
    .map((f) => ({ pattern: f, watched: false }));

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // 2) Entrypoints: el test.ts de la app y el de cada proyecto
    files: [
      { pattern: 'src/test.ts', watched: false },
      ...projectTestEntrypoints
    ],

    // 3) El preprocesador de Angular para **cada** test.ts
    preprocessors: {
      'src/test.ts': ['@angular-devkit/build-angular'],
      ...projectTestEntrypoints.reduce((acc, entry) => {
        acc[entry.pattern] = ['@angular-devkit/build-angular'];
        return acc;
      }, {})
    },

    client: {
      jasmine: {
        // random: false
      },
      clearContext: false
    },

    jasmineHtmlReporter: {
      suppressAll: true
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/lib-magnetar-quill'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },

    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: false,
    concurrency: Infinity,
    restartOnFileChange: true
  });
};
