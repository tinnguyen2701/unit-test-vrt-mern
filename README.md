# Visual Regression Test
Using BackstopJS library 

- `npm run vrt` run all available visual tests (with dev server already started)
- `npm run vrt:ci` run all available visual tests without showing test report
- `npm run vrt:coverage` start dev server and run all available visual tests
- `npm run vrt:approve` approve changes

## Useful command with vrt/backstop.js
- `node vrt/backstop --test --codeModule=src/pages/daenerys/vrt` run visual tests for a particular code module (with dev server already started), can be used when developing an independent module
- `node vrt/backstop --reference` equivalent to `backstop reference`