const express = require('express');
const createError = require('http-errors');
const api = require('../utils/api');
const logger = require('../utils/logger');
const cryptor = require('../utils/cryptor');
const subscriptionStatus = require('./subscriptionStatus');
const countData = require('./countData');
const subscriptionCheck = require('./subscriptionCheck');
const loadTemplate = require('../utils/loadTemplate');

const router = express.Router();

router.get('/apps/:appName/shops/:shopDomain', (req, res) => {
  const { appName, shopDomain } = req.params;

  api
    .callDataProxy('GET', `${appName}/collections/subscriptions?fields=accessToken,shop`, {
      query: {
        'shop.domain': shopDomain,
      },
    })
    .then(response =>
      response.data.documents
        ? res.send({
            shopinfo: response.data.documents,
          })
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send();
    });
});

router.get('/apps/:appName', (req, res) => {
  const { appName } = req.params;
  api
    .callDataProxy(
      'GET',
      `${appName}/collections/subscriptions?fields=accessToken,charge,expiredAt,shop`,
    )
    .then(response =>
      res.send({
        shops: response.data.documents.map(document => ({
          ...document.shop,
          status: subscriptionStatus(document),
        })),
      }),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send(`Data proxy call error`);
    });
});

// get mail
router.get('/mails', (req, res) => {
  api
    .callDataProxy('GET', `sesame/collections/mails`)
    .then(response =>
      response.data.documents
        ? res.send({
            mails: response.data.documents,
          })
        : res.status(204).send(),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send();
    });
});

// add mails
router.post('/mails', (req, res) => {
  api
    .callDataProxy('POST', `sesame/collections/mails`, {
      data: [req.body],
    })
    .then(response =>
      response.data.documents
        ? res.send({
            mails: response.data.documents,
          })
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send();
    });
});

// update mail
router.patch('/mails/:subject', (req, res) => {
  const { subject } = req.params;
  const payload = req.body;

  api
    .callDataProxy('PATCH', `sesame/collections/mails`, {
      query: {
        subject,
      },
      data: {
        subject: payload.subject,
        body: payload.body,
      },
    })
    .then(response =>
      response.data.result && response.data.result.updated === 1
        ? res.sendStatus(204)
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send();
    });
});

// delete mail
router.delete('/mails/:subject', (req, res) => {
  const { subject } = req.params;

  api
    .callDataProxy('DELETE', `sesame/collections/mails`, {
      query: {
        subject,
      },
    })
    .then(response =>
      response.data.result && response.data.result.deleted === 1
        ? res.sendStatus(204)
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, error);
      res.status(500).send();
    });
});

router.get('/apps', (req, res) => {
  const appNames = process.env.REACT_APP_APP_NAMES.split(',');
  Promise.all(
    appNames.map(appName =>
      api.callDataProxy(
        'GET',
        `${appName}/collections/subscriptions?fields=accessToken,charge,expiredAt`,
      ),
    ),
  ).then(responses => {
    res.send({
      statistics: responses.map((response, index) =>
        countData(
          response.data.documents.map(item =>
            JSON.stringify(item) === '{}' ? null : subscriptionStatus(item),
          ),
          appNames[index],
        ),
      ),
    });
  });
});

// Dashboard index, populated with assets from react app
router.get('/dashboard', (req, res, next) => {
  let { application, shop } = req.query;

  application = application && application.toLowerCase();
  shop = shop && shop.toLowerCase();

  const appData = JSON.parse(process.env.APPS_DATA)[application];

  if (!application || !shop || !appData) {
    logger.logDebug(req.path, application, shop, appData);
    next(createError(400, 'Invalid query param or shop data missing!'));
  } else {
    Promise.all([
      api.get(`${appData.url}dashboard/asset-manifest.json`),
      api.callDataProxy('GET', `${application}/collections/subscriptions`, {
        query: {
          'shop.domain': shop,
        },
      }),
    ])
      .then(([assetManifestResponse, subscriptionResponse]) => {
        const { data } = assetManifestResponse;

        if (!data) next(createError(404, 'Resources not available!'));

        const jsAssets = Object.keys(data)
          .filter(key => key.indexOf('.js') > 0)
          .map(key => ({ src: data[key] }));

        res.render('dashboard', {
          globalVar: appData.globalVar,
          application,
          shop,
          apiKey: appData.apiKey,
          subscriptionInfo: subscriptionCheck(subscriptionResponse.data.documents[0]),
          jsAssets,
        });
      })
      .catch(next);
  }
});

router.get('/users', (req, res) => {
  api
    .callDataProxy('GET', 'sesame/collections/users?fields=email,name,role')
    .then(response =>
      response.data.documents ? res.send({ users: response.data.documents }) : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, 'Data proxy call error', error);
      return res.sendStatus(500);
    });
});

router.post('/users', (req, res) => {
  const { user } = req.body;

  user.password = cryptor(user.password);

  api
    .callDataProxy('POST', 'sesame/collections/users', { data: [user] })
    .then(response =>
      response.data.documents
        ? res.send({ user: response.data.documents[0] })
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, 'Data proxy call error', error);
      return res.sendStatus(500);
    });
});

router.patch('/users/:email', (req, res) => {
  const { email } = req.params;
  const { user } = req.body;

  user.password = cryptor(user.password);

  api
    .callDataProxy('PATCH', 'sesame/collections/users', {
      query: { email },
      data: user,
    })
    .then(response =>
      response.data.result && response.data.result.updated === 1
        ? res.sendStatus(204)
        : res.sendStatus(500),
    )
    .catch(error => {
      logger.logError(req.path, 'Data proxy call error', error);
      return res.sendStatus(500);
    });
});

router.delete('/users/:email', (req, res) => {
  const emails = req.params.email.split(',');
  Promise.all(
    emails.map(email =>
      api.callDataProxy('DELETE', 'sesame/collections/users', { query: { email } }),
    ),
  ).then(responses => (responses ? res.sendStatus(204) : res.sendStatus(500)));
});

router.post('/sendmail', (req, res) => {
  const { recipients, appName, subject, body } = req.body;

  loadTemplate('mailTemplate', { recipients, appName, body, subject })
    .then(results =>
      Promise.all(
        results.map(result =>
          req.app.locals.transporter.sendMail({
            to: result.recipient.email,
            from: process.env.MAIL_USERNAME,
            subject,
            html: result.email.html,
          }),
        ),
      ),
    )
    .then(() => {
      return res.sendStatus(200);
    })
    .catch(err => {
      logger.logError(req.path, 'send mail went wrong', err);
      return res.sendStatus(500);
    });
});

module.exports = router;
