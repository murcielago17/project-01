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
mongoose.connect('mongodb://localhost/project-01');

// require Comment and User models
var Comment = require('./models/comment'),
    User = require('./models/user'),
    Photo = require('./models/photo');

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
// passport.use(new GitHubStrategy({
//   clientID: oauth.github.clientID,
//   clientSecret: oauth.github.clientSecret,
//   callbackURL: oauth.github.callbackURL
// }, function (accessToken, refreshToken, profile, done) {
//   User.findOne({ oauthID: profile.id }, function (err, foundUser) {
//     if (foundUser) {
//       done(null, foundUser);
//     } else {
//       var newUser = new User({
//         oauthID: profile.id,
//         username: profile.username
//       });
//       newUser.save(function (err, savedUser) {
//         console.log('saving user...');
//         done(null, savedUser);
//       });
//     }
//   });
// }));

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

// get all photos
app.get('/api/photos', function (req, res) {
  // find all photos in db
  Photo.find(function (err, allPhotos) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({photos: allPhotos});
    }
  });
});


// create new photo
app.post('/api/photos', function (req, res) {
  
  var newPhoto = new Photo(req.body);

  // save new photo in db
  newPhoto.save(function (err, savedPhoto) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
     
      res.json(savedPhoto);
    }
  });
});

// // get one post
// app.get('/api/photoComment/:id', function (req, res) {
//   // get post id from url params (`req.params`)
//   var photoCommentId = req.params.id;

//   // find post in db by id
//   PhotoComment.findOne({ _id: postId }, function (err, foundPhotoComment) {
//     if (err) {
//       if (err.name === "CastError") {
//         res.status(404).json({ error: "Nothing found by this ID." });
//       } else {
//         res.status(500).json({ error: err.message });
//       }
//     } else {
//       res.json(foundPost);
//     }
//   });
// });

// // update post
// app.put('/api/photoComment/:id', function (req, res) {
//   // get post id from url params (`req.params`)
//   var postId = req.params.id;

//   // find post in db by id
//   Post.findOne({ _id: postId }, function (err, foundPhotoComment) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       // update the posts's attributes
//       foundPhotoComment.title = req.body.title;
//       foundPhotoComment.description = req.body.description;

//       // save updated post in db
//       foundPhotoComment.save(function (err, savedPhotoComment) {
//         if (err) {
//           res.status(500).json({ error: err.message });
//         } else {
//           res.json(savedPost);
//         }
//       });
//     }
//   });
// });

// // delete post
// app.delete('/api/photoComment/:id', function (req, res) {
//   // get post id from url params (`req.params`)
//   var photoCommentId = req.params.id;

//   // find post in db by id and remove
//   PhotoComment.findOneAndRemove({ _id: postId }, function (err, deletedPhotoComment) {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.json(deletedPost);
//     }
//   });
// });





    // listen on heroku or port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});