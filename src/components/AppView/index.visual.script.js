module.exports = async (page, scenario) => {
  if (scenario.label === 'AppView - search shops') {
    await page.type('#TextField1', 'eye');
  }

  if (scenario.label === 'AppView - select category') {
    await page.select('#Select2', 'Paid');
  }

  if (scenario.label === 'AppView - select all checkbox') {
    await page.click('.Polaris-Checkbox:first-child');
  }

  if (scenario.label === 'AppView - select a checkbox') {
    await page.click('.Polaris-ResourceList__ItemWrapper:first-child .Polaris-Checkbox');
  }
};
