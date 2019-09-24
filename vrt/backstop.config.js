module.exports = options => ({
  id: 'visualtest',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 786,
      height: 500,
    },
    {
      label: 'desktop',
      width: 992,
      height: 768,
    },
  ],
  // onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  scenarios: options.scenarios,
  paths: {
    bitmaps_reference: 'vrt/bitmaps_reference',
    bitmaps_test: 'vrt/bitmaps_test',
    engine_scripts: 'vrt/engine_scripts',
    html_report: 'vrt/html_report',
    ci_report: 'vrt/ci_report',
  },
  report: options.report,
  engine: 'puppeteer',
  engineOptions: {
    chromeFlags: ['--ignore-certificate-errors', '--no-sandbox'],
  },
  asyncCaptureLimit: 1,
  asyncCompareLimit: 50,
  debug: options.debug,
  debugWindow: options.debugWindow,
});
