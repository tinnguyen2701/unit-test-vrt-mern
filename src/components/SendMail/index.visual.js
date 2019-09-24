const scenario1 = {
  label: 'Mails - Load component',
  url: `http://localhost:3000/appview/ezicompare`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario2 = {
  label: 'Mails-LoadDialog-SelectNewMail',
  url: `http://localhost:3000/appview/ezicompare`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario3 = {
  label: 'Mails-LoadDialog-SelectNewMail-InvalidInput-Save',
  url: `http://localhost:3000/appview/ezicompare`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

const scenario4 = {
  label: 'Mail-LoadDialog-SelectNewMail-ValidInput-Save',
  url: `http://localhost:3000/appview/ezicompare`,
  onReadyScript: './index.visual.script.js',
  delay: 3000,
};

module.exports = [scenario1, scenario2, scenario3, scenario4];
