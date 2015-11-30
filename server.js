// require modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('express-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    oauth = require('./oauth.js');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// connect to mongodb
mongoose.connect('mongodb://localhost/photPlace-app');

// require Post and User models
var PhotoComment = require('./models/photoComment'),
    User = require('./models/user');

// middleware for auth
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// send flash messages
app.use(flash());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport-github config
passport.use(new GitHubStrategy({
  clientID: oauth.github.clientID,
  clientSecret: oauth.github.clientSecret,
  callbackURL: oauth.github.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  User.findOne({ oauthID: profile.id }, function (err, foundUser) {
    if (foundUser) {
      done(null, foundUser);
    } else {
      var newUser = new User({
        oauthID: profile.id,
        username: profile.username
      });
      newUser.save(function (err, savedUser) {
        console.log('saving user...');
        done(null, savedUser);
      });
    }
  });
}));


    // listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});