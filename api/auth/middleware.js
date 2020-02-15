// const bcrypt = require('bcryptjs')

// const Users = require('../auth/model')

// module.exports = (req, res, next) => {

//   const { username, password } = req.headers;

//   if (usermame && password) {
//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.passwod)) {
//           next();
//         } else {
//           registerReq.status(401).json({ message: 'invalid credentials' })
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: 'Ran into an unexpected error' })
//       })
//   } else {
//     res.status(400).json({ message: 'No credentials provided' })
//   }
  
// };


module.exports = (req, res, next) => {

  const { username, password } = req.headers;

  if (req.session && req.session.user) {
next();
    res.status(401).json({ message: 'Bad Credentials' })
  }
  
};


const { getUserByProperty } = require("./model.js");

module.exports = { restricted, registerReq, loginReq, uniqueUserReg };

// Tuesday's project middleware.
/**
 * Place before restricted routes that a user must be logged in for.
 * @param {*} req request object from express
 * @param {*} res response object from express
 * @param {*} next next function from express
 */
function restricted(req, res, next) {
  console.log("In Restricted mw.");
  console.log(
    `*****\n REQ.SESSION: ${req.session}\n****\n REQ.SESSION.USERNAME: ${req.session.username}`
  );
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({
      message: "Please login before attempting to access this route."
    });
  }
}

/**
 * validates that all required parts of users table is there
 * before we attempt to add to the database
 *
 * needs a username, password, email.
 */
function registerReq(req, res, next) {
  let { username, password, email } = req.body;

  switch (true) {
    case !req.body:
      return res.status(400).json({ message: "Usename, Password and Email are Required" });
    case !username:
      return res.status(400).json({ message: "Please add an username." });
    case !password:
      return res.status(400).json({ message: "Please add a password." });
    case !email:
      return res.status(400).json({ message: "Please add an email." });
    default:
      next();
  }
}

// creating more helpful errors for unique validation issues.
function uniqueUserReg(req, res, next) {
  let { username, email } = req.body;

  getUserByProperty({ username: username })
    .then(user => {
      if (user) {

        switch (true) {
          case user:
            return res.status(400).json({ message: "Please try another username that one is in use already." });
          case: !user:
            return
            getUserByProperty({ email: email })
              .then(user => {
                if (user)
                  res.status(400).json({
                    message:
                      "Sorry. That email has been taken. Please choose another."
                  }

        res.status(400).json({
                    message: "Sorry. That username has been taken. Please choose another."
                  });
              } else {
                getUserByProperty({ email: email })
          .then(user => {
                  if (user)
                    res.status(400).json({
                      message:
                        "Sorry. That email has been taken. Please choose another."
                    });
                  else next();
                })
                  .catch(err =>
                    res.status(500).json({
                      message:
                        "Sorry. Something went wrong in validating that email is unique.",
                      error: err,
                      error_mesage: err.message
                    })
                  );
              }
    })
    .catch(err =>
      res.status(500).json({
        message:
          "Sorry. Something went wrong in validating that username is unique.",
        error: err,
        error_mesage: err.message
      })
    );
}

/**
 * validates that existence of credentials
 * before we attempt to login and give them a session
 */
function loginReq(req, res, next) {
  let { username, password } = req.body;

  switch (true) {
    case !req.body:
      return res.status(400).json({ message: "Please add a username and password." });
    case !username:
      return res.status(400).json({ message: "Please add an username." });
    case !password:
      return res.status(400).json({ message: "Please add a password." });
    default:
      next();
  }
}
