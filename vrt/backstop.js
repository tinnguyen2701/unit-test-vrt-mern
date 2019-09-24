/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const backstop = require('backstopjs');
const args = require('yargs').argv;
const glob = require('glob');
const path = require('path');

const commonScenarioAttributes = {
  url: 'http://localhost:3000/',
  misMatchThreshold: 0.1,
  delay: 50,
};

const resolveScriptPaths = (scenario, dir) => {
  const { onReadyScript, onBeforeScript } = scenario;
  let resolved = scenario;

  if (onReadyScript) resolved = { ...resolved, onReadyScript: path.resolve(dir, onReadyScript) };
  if (onBeforeScript) resolved = { ...resolved, onBeforeScript: path.resolve(dir, onBeforeScript) };

  return resolved;
};

const findScenariosToRun = (codeModule, callback) => {
  const searchPattern = `${codeModule ? `${codeModule}/` : ''}**/*.visual.js`;

  glob(searchPattern, null, (error, files) => {
    if (files) {
      const scenarios = [];

      files.forEach(file => {
        const moduleScenarios = require(path.resolve(file));

        moduleScenarios.forEach(scenario => {
          const scenarioWithAbsoluteScriptPath = resolveScriptPaths(
            {
              ...commonScenarioAttributes,
              ...scenario,
            },
            path.dirname(file),
          );
          scenarios.push(scenarioWithAbsoluteScriptPath);
        });
      });

      callback(scenarios);
    }
  });
};

let command = '';

if (args.reference) {
  command = 'reference';
}

if (args.test) {
  command = 'test';
}

if (args.openReport) {
  command = 'openReport';
}

if (args.approve) {
  command = 'approve';
}

const report = args.report || 'browser';
const debug = args.debug || false;
const debugWindow = args.debugWindow || false;

if (command) {
  findScenariosToRun(args.codeModule || '', scenarios => {
    if (scenarios.length) {
      const config = require('./backstop.config.js')({
        scenarios,
        report,
        debug,
        debugWindow,
      });
      backstop(command, { config });
    }
  });
}
