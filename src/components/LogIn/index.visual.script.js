module.exports = async (page, scenario) => {
  if (scenario.label === 'LogIn with wrong account') {
    await page.type('input:first-child', 'nguyendinhtin27011998@gmail.com');
    await page.type('input[type="password"]', 'not_admin');
    await page.click('button');
  }
  if (scenario.label === 'LogIn with right account') {
    await page.type('input:first-child', 'nguyendinhtin27011998@gmail.com');
    await page.type('input[type="password"]', '696969');
    await page.click('button');
  }

  if (scenario.label === 'LogIn with invalid input') {
    await page.click('button');
  }
};
