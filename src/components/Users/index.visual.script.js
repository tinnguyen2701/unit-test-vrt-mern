module.exports = async (page, scenario) => {
  if (scenario.label === 'User - add error') {
    await page.click('.Polaris-ResourceList__AlternateToolWrapper button');
    await page.type('.Polaris-FormLayout__Item:first-child input', 'huy12@gmail');
    await page.type('.Polaris-FormLayout__Item:nth-child(2) input', '12345');
    await page.type('.Polaris-FormLayout__Item:nth-child(3) input', 'huy12');
    await page.click('.Polaris-FormLayout__Item:nth-child(5) button');
  }

  if (scenario.label === 'User - add') {
    await page.click('.Polaris-ResourceList__AlternateToolWrapper button');
    await page.type('#TextField1', 'huy121@gmail.com');
    await page.type('#TextField2', '123456');
    await page.type('#TextField3', 'huy123');
    await page.click('.Polaris-FormLayout__Item:nth-child(5) button');
  }

  if (scenario.label === 'User - edit') {
    await page.click('li.Polaris-ResourceList__ItemWrapper:first-child button');
  }

  if (scenario.label === 'User - delete') {
    await page.click('li.Polaris-ResourceList__ItemWrapper:first-child .Polaris-Checkbox');
  }
};
