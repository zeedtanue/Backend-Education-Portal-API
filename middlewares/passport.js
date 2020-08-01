const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Parent = require("../models/Parents");
const { SECRET } = require("../config");
const { Strategy, ExtractJwt } = require("passport-jwt");
const Admin = require("../models/Admin");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

module.exports = passport => {
  passport.use('passport-user',
    new Strategy(opts, async (payload, done) => {
      await User.findById(payload.user_id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          return done(null, false);
        });
    })
  );

  passport.use('passport-teacher',
  new Strategy(opts, async (payload, done) => {
    await Teacher.findById(payload.user_id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => {
        return done(null, false);
      });
  })
);
passport.use('passport-parent',
new Strategy(opts, async (payload, done) => {
  await Parent.findById(payload.user_id)
    .then(user => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(err => {
      return done(null, false);
    });
})
);
passport.use('passport-admin',
new Strategy(opts, async (payload, done) => {
  await Admin.findById(payload.user_id)
    .then(user => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(err => {
      return done(null, false);
    });
})
);




};
