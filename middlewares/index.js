/**
 * This file will bundled all the middlewares together inside a single object which can then be exported and used further
 */

const requestValidator = require("./requestValidator");
const signUpValidator = require("./verifySignUp");

module.exports = {
  requestValidator,
  signUpValidator,
};
