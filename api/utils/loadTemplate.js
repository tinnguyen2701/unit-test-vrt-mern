const { EmailTemplate } = require('email-templates'); // must be version @2.x.x
const path = require('path');

module.exports = (templateName, data) => {
  const template = new EmailTemplate(path.join(__dirname, '../views', templateName));
  const { recipients, appName, body, subject } = data;

  return Promise.all(
    recipients.map(
      recipient =>
        new Promise((resolve, reject) => {
          template.render(
            { appName, recipientName: recipient.name, body, subject },
            (err, result) => {
              if (err) reject(err);
              else
                resolve({
                  email: result,
                  recipient,
                });
            },
          );
        }),
    ),
  );
};
