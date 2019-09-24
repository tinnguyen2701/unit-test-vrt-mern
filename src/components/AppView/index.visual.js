const initial = {
  label: 'AppView - Load component',
  url: `http://localhost:3000/appview/negotiation`,
  delay: 3000,
};

const testAppView2 = {
  label: 'AppView - search shops',
  url: `http://localhost:3000/appview/negotiation`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const testAppView3 = {
  label: 'AppView - select category',
  url: `http://localhost:3000/appview/negotiation`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const testAppView4 = {
  label: 'AppView - select all checkbox',
  url: `http://localhost:3000/appview/negotiation`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const testAppView5 = {
  label: 'AppView - select a checkbox',
  url: `http://localhost:3000/appview/negotiation`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

module.exports = [initial, testAppView2, testAppView3, testAppView4, testAppView5];
