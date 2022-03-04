/**
 * This file will contain the schema details of the user
 */

module.exports = (sequelize, Sequelize) => {
  //id we don't provide the id explicitly then sequelize will provide the id,implictly and made it as primaryKEY
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
