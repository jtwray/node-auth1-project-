// for restricted stretch.

const router = require("express").Router();

// db functions
const { getUsers, updateUser, removeUser } = require("../auth/model.js");

// middleware functions
const { validateUserPermissions } = require("./middleware.js");

// gets all usersnames -- stretch display
router.get("/", (req, res) => {
  console.log("USERS***********");
  console.log("req.session: ", req.session);
  getUsers()
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json({
        message: "Sorry something went wrong in getting all users.",
        error: err,
        error_message: err.message
      })
    );
});

// allows update of user that is logged in
router.put("/:user_id", validateUserPermissions, (req, res) => {
  const id = req.params.user_id;
  const changes = req.body;

  updateUser(id, changes)
    .then(updated => res.status(200).json(updated))
    .catch(err =>
      res.status(500).json({
        message: "Sorry something went wrong in updating that user.",
        error: err,
        error_message: err.message
      })
    );
});

// allows deletion of user that is logged in
router.delete("/:user_id", validateUserPermissions, (req, res) => {
  const id = req.params.user_id;

  removeUser(id)
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json({
        message: "Sorry something went wrong in deleting that user.",
        error: err,
        error_message: err.message
      })
    );
});

module.exports = router;
