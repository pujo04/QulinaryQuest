const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:8081', 
      show: true,
      waitForNavigation: 'networkidle',
      timeout: 30000 
    }
  },
  include: {
    I: './steps_file.js'
  },
  plugins: {
    pauseOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 2
    }
  },
  name: 'restaurant-apps-starter-project3'
};