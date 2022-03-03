if (process.env.NODE_ENV !== "production") {
  //if environment in which server running is not production environment then read values from the environment file .env
  require("dotenv").config();
}

module.exports = {
  DB: process.env.DB,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  dialect: "mysql",
  pool: {
    min: 0, //At a minimum, have zero open connections/maintain no minimum number of connections
    max: 5, //maximum 5 open connection possible at peak load
    acquire: 30000, //wait for 30000ms before aborting(if no success) a connection request
    idle: 1000, //Remove a connection from the pool after the connection has been idle (not been used) for 1000ms ie. 1sec
  },
};
