/**
 * This file will be responsible for routing the requests at /auth of signup or singin to the correct controller method
 *
 */

const authController = require("../controllers/auth.controller");
const { signUpValidator } = require("../middlewares");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/ecommService/api/v1/auth/signup",
    [
      signUpValidator.checkInputInValidFormat,
      signUpValidator.checkDuplicateUsernameOrEmail,
      signUpValidator.checkInputRolesValid,
    ],
    authController.signup
  );

  app.post("/ecommService/api/v1/auth/signin", authController.signin);
};
