const jwt = require('passport-jwt');
const { Strategy, ExtractJwt } = jwt;

const User = require('../src/models/user');
const { authSecret } = require('./secrets');

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = authSecret;

    passport.use(new Strategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.uid, (err, user) => {
            if(err) {
                return done(err, false);
            }
            if(user) {
                return done(null, {
                    uid: user._id,
                    email: user.email
                });
            } else {
                return done(null, false);
            }
        });
    }));
}
