const scenario1 = {
  label: 'User - Load component',
  url: `http://localhost:3000/users`,
  delay: 3000,
};

const scenario2 = {
  label: 'User - add error',
  url: `http://localhost:3000/users`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario3 = {
  label: 'User - add',
  url: `http://localhost:3000/users`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario4 = {
  label: 'User - edit',
  url: `http://localhost:3000/users`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario5 = {
  label: 'User - delete',
  url: `http://localhost:3000/users`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

module.exports = [scenario1, scenario2, scenario3, scenario4, scenario5];
