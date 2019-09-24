module.exports = async (page, scenario) => {
  if (scenario.label === 'Mails - Load component') {
    await page.click('.Polaris-Checkbox:first-child');
    await page.click('.Polaris-ResourceList-BulkActions__ButtonGroup button:nth-child(2)');
  }

  if (scenario.label === 'Mails-LoadDialog-SelectNewMail') {
    await page.click('.Polaris-Checkbox:first-child');
    await page.click('.Polaris-ResourceList-BulkActions__ButtonGroup button:nth-child(2)');
    await page.select('.Polaris-Modal-Section .Polaris-Select__Input', '[New Mail]');
  }
  if (scenario.label === 'Mails-LoadDialog-SelectNewMail-InvalidInput-Save') {
    await page.click('.Polaris-Checkbox:first-child');
    await page.click('.Polaris-ResourceList-BulkActions__ButtonGroup button:nth-child(2)');
    await page.select('.Polaris-Modal-Section .Polaris-Select__Input', '[New Mail]');
    await page.type('.Polaris-TextField input:first-child', 'Happy New Year 2020');
    await page.click(
      '.Polaris-Stack.Polaris-Stack--spacingExtraLoose >div:nth-child(2) .Polaris-Stack__Item:nth-child(2) button',
    );
  }

  if (scenario.label === 'Mail-LoadDialog-SelectNewMail-ValidInput-Save') {
    await page.click('.Polaris-Checkbox:first-child');
    await page.click('.Polaris-ResourceList-BulkActions__ButtonGroup button:nth-child(2)');
    await page.select('.Polaris-Modal-Section .Polaris-Select__Input', '[New Mail]');
    await page.type('.Polaris-TextField input:first-child', 'Happy New Year 2049');
    await page.click(
      '.Polaris-Stack.Polaris-Stack--spacingExtraLoose >div:nth-child(2) .Polaris-Stack__Item:nth-child(2) button',
    );
  }
};
