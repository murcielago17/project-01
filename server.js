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
    GitHubStrategy = require('passport-github').Strategy;
    // oauth = require('./oauth.js');

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

// HOMEPAGE ROUTE

app.get('/', function (req, res) {
    // sanity check
    // res.render('index');
  res.render('index', { user: req.user });
});


// AUTH ROUTES

// show signup view
app.get('/signup', function (req, res) {
  // if user is logged in, don't let them see signup view
  if (req.user) {
    res.redirect('/profile');
  } else {
    res.render('signup', { user: req.user, errorMessage: req.flash('signupError') });
  }
});

// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/signup', function (req, res) {
  // if user is logged in, don't let them sign up again
  if (req.user) {
    res.redirect('/profile');
  } else {
    User.register(new User({ username: req.body.username }), req.body.password,
      function (err, newUser) {
        if (err) {
          // res.send(err);
          req.flash('signupError', err.message);
          res.redirect('/signup');
        } else {
          passport.authenticate('local')(req, res, function () {
            res.redirect('/profile');
          });
        }
      }
    );
  }
});

// show login view
app.get('/login', function (req, res) {
  // if user is logged in, don't let them see login view
  if (req.user) {
    res.redirect('/profile');
  } else {
    res.render('login', { user: req.user });
  }
});

// log in user
app.post('/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/profile');
});

// log out user
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// show user profile page
app.get('/profile', function (req, res) {
  // only show profile if user is logged in
  if (req.user) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/auth/github', passport.authenticate('github'), function (req, res) {
  // the request will be redirected to github for authentication,
  // so this function will not be called
});

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.user);
    res.redirect('/profile');
  }
);


// API ROUTES

// get all posts
app.get('/api/photoComment', function (req, res) {
  // find all posts in db
  PhotoComment.find(function (err, allPhotoComments) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ posts: allPhotoComments });
    }
  });
});



    // listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});