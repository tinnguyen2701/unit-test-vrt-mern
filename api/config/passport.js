/* eslint-disable */

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const api = require('../utils/api');

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('jwtToken'),
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, function(jwt_payload, done) {
      api
        .callDataProxy('GET', 'sesame/collections/users')
        .then(response => {
          if (!response || !response.data || !response.data.documents) return done(null, false);

          const currentUser = response.data.documents.find(
            user => user.email === jwt_payload.email,
          );

          if (currentUser) return done(null, currentUser);

          return done(null, false);
        })
        .catch(err => done(err, false));
    }),
  );
};
