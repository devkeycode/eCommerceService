if (process.env.NODE_ENV !== "production") {
  //if environment in which server running is not production environment then read values from the environment file .env
  require("dotenv").config();
}

module.exports = {
  PORT: process.env.PORT,
};
