const { StatusCodes } = require('http-status-codes');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-github2');

const usersController = require('./controllers/users_c.js');

const app = express();

// Serve static files from the "utilities" directory
app.use('/utilities', express.static('utilities'));

const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const apiDocsRoute = require('./routes/api-docs');
const mongoDb = require('./database/data');

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'development',
    httpOnly: true,
    maxAge: 3600000, // 1 hour
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use the GitHub strategy
passport.use(new Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    // Write query to retrieve the user by profile id
    const user = usersController.getUserByProfileId(profile.id);

    if (!user) {
      // If user is not found, create a new user
      const newUser = usersController.addUser({
        profileId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        profileUrl: profile.profileUrl,
      });
      return done(null, newUser);
    }
    return done(null, profile);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersController.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs',
  session: false,
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address. Please try again after an hour.',
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/utilities/static/styles.css">
      </head>
      <body>
        <img src="/utilities/static/green-check-mark.png" alt="Wildlife Observation API" class="api-status">
        <div class="status-content">
          <h1>API is running</h1>
          <p>Welcome to the Wildlife Observation API</p>
          <p><a href="/api-docs">Go to the API docs</a></p>
        </div>
      </body>
    </html>
  `);
});


// Protect all routes with rate limiter to prevent abuse
app.use('/', limiter);
app.use('/', routes);
app.use('/api-docs', apiDocsRoute);

// Middleware to handle errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: `Something went wrong while querying ${req.originalUrl}`, 
  });
});

mongoDb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Running on port ${port}`));
  }
});
