// write elastic search query to find user by email
const { client } = require("../config/db");

function userService() {
  const findUserByEmail = async (value) => {
    const response = await client.search({
      index: "users",
      body: {
        query: {
          term: { "email.keyword": value },
        },
      },
    });

    if (response.hits.total.value !== 1) {
      return null;
    }

    let user = response.hits.hits[0]._source;

    return user;
  };

  const addUser = async (email, phash) => {
    const response = await client.index({
      index: "users",
      body: { email: email, password: phash },
    });

    return response;
  };

  return {
    findUserByEmail,
    addUser,
  };
}

module.exports = { userService };
