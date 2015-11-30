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

    // listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});