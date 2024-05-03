const { defineConfig } = require('cypress')

module.exports = defineConfig({
  "fileServerFolder": ".",
  "fixturesFolder": "./src/fixtures",
  "modifyObstructiveCode": false,
  "video": true,
  "videosFolder": "../../dist/cypress/apps/report-tester-e2e/videos",
  "screenshotsFolder": "../../dist/cypress/apps/report-tester-e2e/screenshots",
  "chromeWebSecurity": false,
  e2e: {
    setupNodeEvents(on, config) {
/*      on('before:browser:launch', (browser, launchOptions) => {
        console.log('In Browser Launch '+browser.family, browser);
        if (browser.family === 'chromium') {
          console.log('Disabling gpu');
          launchOptions.args.push('--disable-gpu')
        }
      })*/
    },
    specPattern: './src/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts'
  },
})
