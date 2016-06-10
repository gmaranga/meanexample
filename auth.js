// TODO: make setupAuth depend on the Config service...
function setupAuth(User, app) {
  var Config = require('./config.json');
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth2').Strategy;

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  // Google-specific
  passport.use(new GoogleStrategy(
    {
      // TODO: and use the Config service here
      clientID: Config.googleClientId,
      clientSecret: Config.googleClientSecret,
      callbackURL: 'https://meanexample-gmaranga.c9users.io:' + process.env.PORT +'/auth/google/callback',
      passReqToCallback   : true
    },
    function(req, accessToken, refreshToken, profile, done) {
      if (!profile.emails || !profile.emails.length) {
        return done('No emails associated with this account!');
      }

      User.findOneAndUpdate(
        { 'data.oauth': profile.id },
        {
          $set: {
            'profile.username': profile.emails[0].value,
            'profile.picture': profile.photos[0].value
          }
        },
        { 'new': true, upsert: true, runValidators: true },
        function(error, user) {
          done(error, user);
        });
    }));

  // Express middlewares
  app.use(require('express-session')({
    secret: 'this is a secret'
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/plus.me'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/fail' }),
    function(req, res) {
      res.send('Welcome, ' + req.user.profile.username);
    });
}

module.exports = setupAuth;
