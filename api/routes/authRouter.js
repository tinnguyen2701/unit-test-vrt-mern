/* eslint-disable */
const authRouter = require('express').Router();
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const cryptor = require('../utils/cryptor');
const api = require('../utils/api');
const logger = require('../utils/logger');

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.logError(req.path, 'fields are required');
    return res.sendStatus(400);
  } else {
    api
      .callDataProxy('GET', 'sesame/collections/users')
      .then(response => {
        if (!response || !response.data || !response.data.documents) {
          logger.logError(req.path, 'documents not found');
          return res.sendStatus(500);
        }

        const user = response.data.documents.find(document => document.email === email) || null;

        if (!user || user.password !== cryptor(password)) {
          logger.logError(req.path, 'user not found');
          return res.sendStatus(403);
        } else {
          const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3m' });

          const mainOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'verified code',
            text: 'You recieved code from sesame',
            html: `<p>You have got a new code: ${token}</p>`,
          };

          req.app.locals.transporter.sendMail(mainOptions, (err, info) => {
            if (err) {
              logger.logError(err);
            } else {
              logger.logInfo(`send code verify success ${info.response}`);
            }
          });

          return res.status(200).send(email);
        }
      })
      .catch(error => {
        logger.logError(req.path, 'Data proxy call error ', error);
        return res.sendStatus(500);
      });
  }
});

authRouter.post('/verifiedCode', (req, res) => {
  const { code, email } = req.body;
  if (!email || !code) return res.sendStatus(400);

  try {
    const decoded = jwtDecode(code);

    if (decoded.email !== email) return res.sendStatus(400);
    if (Date.now() / 1000 > decoded.exp) return res.sendStatus(403);
    else {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).send(token);
    }
  } catch (error) {
    logger.logError(req.path, 'can not decode token');
    return res.sendStatus(403);
  }
});

module.exports = authRouter;
