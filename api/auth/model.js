const db = require("../dbConfig.js");

module.exports = {
  getUsers,
  getUserByProperty, // needed for MVP
  getUserBy, // needed for MVP
  addUser, // needed for MVP
  updateUser,
  removeUser
};

/**
 * Gets a list of usernames
 * @returns {Array} -- of all current usernames.
 */
function getUsers() {
  return db("users").select("users.username");
}

/**
 * Gets a user by a property of the users table.
 * @param {object} property -- could be id, username, email.
 * @returns {user} -- id, username, and email of the user you searched for.
 */
function getUserByProperty(property) {
  return db("users")
    .select("users.id", "users.username", "users.email")
    .where(property)
    .first();
}

/**
 * Gets a user by a property of the users table.
 * @param {object} property -- could be id, username, email.
 * @returns {user} -- id, username, and email, AND PASSWORD of the user you searched for.
 */
function getUserBy(property) {
  return db("users")
    .where(property)
    .first();
}

/**
 * Adds a new user to the database
 * @param {object} newUser -- needs username, password, and email
 * @returns {user} returns the new user created with id, username, and email.
 */
async function addUser(newUser) {
  const [id] = await db("users").insert(newUser, "id");
  const user = await getUserBy({ id });
  return user;
}

/**
 * Updates a user in database.
 * @param {integer} id -- existing id in database
 * @param {object} changes -- whatever changes you'd like to update, username, email, or password.
 * @returns {updatedUser} -- returns user with id, username, and email with updated information.
 */
async function updateUser(id, changes) {
  await db("users")
    .where({ id })
    .update(changes);
  const updatedUser = await getUserByProperty({ id });
  return updatedUser;
}

/**
 * Deletes a user in database
 * @param {integer} id -- integer of existing user in database.
 * @returns {Array} users so FE can easily update current list of users if in use on delete.
 */
async function removeUser(id) {
  await db("users")
    .where({ id })
    .del();
  const users = await getUsers();
  return users;
}
