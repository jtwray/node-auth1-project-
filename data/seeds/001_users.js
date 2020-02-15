
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { username: "admin", password: "password", email: "admin@gmail.com" },
        {
          username: "newuser",
          password: "password",
          email: "newuser@gmail.com"
        },
        {
          username: "newnewuser",
          password: "password",
          email: "newnewuser@gmail.com"
        }
      ]);
    });
};
