const express = require("express");
// hides what packages we're using.
const helmet = require("helmet");
// For Stretch
const cors = require("cors");
// really awesome logger, check it out on npm https://www.npmjs.com/package/morgan
const morgan = require("morgan");

// Tuesday's MVP
const session = require("express-session");


// stretch(ish) -- session store
const KnexSessionStore = require("connect-session-knex")(session);
const dbConnection = require("./dbConfig.js");

// importing custom middleware
const { restricted } = require("./auth/middleware.js");

// importing routes
const AuthRouter = require("./auth/route.js");
const UsersRouter = require("./users/route.js");

const server = express();

// 12 - 22 is for Tuesday's MVP.
const sessionConfig = {
  name: "jwt|bananawords|datetime",
  secret: process.env.SESSION_SECRET || "happybirthdayfrosty",
  cookie: {

    maxAge: 1 * 60 * 60 * 1000,//1000 millseconds * 60 secs * 60 minutes * 1hr === 1hour total time until this current cookie expires
    secure: false,//send over encrypted connection like https true in production?
        httpOnly: true,//the clientside javascript never gets access to the cookie
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000
  })
};

// all needed for MVP
server.use(helmet()); // protecting what packages we're using
// Global middleware
server.use(
  cors({
    credentials: true, // accept and send cookies to those cors requests
    origin: "http://localhost:3000" // normally set to * for anyone to make a request || set a spefic domain for cookies.
    // with this config we also need to have FE set up axios calls with
    // { withCredentials: true }  -- any request you want cookies to have access to.

    /**
     *
     *  some documentation on setting up cookies with express/cors/axios/react
     *
     *  cors docs with configuring cors
     *  https://www.npmjs.com/package/cors#configuring-cors
     *
     *  axios docs for all options
     *  https://www.npmjs.com/package/axios
     *
     *  this is the section further down the page for the withCredentials
     *   // `withCredentials` indicates whether or not cross-site Access-Control requests
     *   // should be made using credentials
     *   withCredentials: false, // default
     *
     *  an article for cors and expresss
     *  https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
     *
     *  an article for fetch and axios with cookies:
     *  https://codewithhugo.com/pass-cookies-axios-fetch-requests/
     *
     */
  })
); // needed for React App stretch.
server.use(session(sessionConfig)); // for Tuesday's with sessions and cookies -- not recommended for build week.
server.use(express.json());
server.use(morgan("dev"));

// test route -- has to be before restricted middleware currently on line 95.
server.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `<h1>Server is up and running</h1><p>Try hitting '/api/auth/register' next!</p>`
    );
});

// delcaring routes with middleware
server.use("/api/auth", AuthRouter);
// having my middleware set up like this will cause all routes under it to use the restricted middleware
server.use(restricted);
// I could also have written it like
// server.use("/api/restricted/users", restricted, UsersRouter)
// to only effect the routes I choose.
server.use("/api/restricted/users", UsersRouter);

module.exports = server;
