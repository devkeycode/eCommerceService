/**
 * This file will bundled all the schemas defined under the model directory along with a db connection into a single object and will export it for further use.
 *
 * One of the advantage of using index.js file is, other file trying to import this files, just need to provide the module name
 *
 * For example : require(./models); // No need to specify the file name index.js
 */

const Sequelize = require("sequelize"); //importing the sequelize orm
const config = require("../configs/db.config"); //importing the db configurations to use while establishing a connection

/**
 * Establishing the db connection
 */

//extracting the info form config object thru destructuring
const { DB, HOST, USER, PASSWORD, dialect } = config;

//sequelize representing the db connection object
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

/**
 * To expose the sequelize db connection and Sequelize class and models/schemas , creating an object named db ,which will be exporting from this file for further use
 */

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.category = require("./category.model")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);

module.exports = db;
