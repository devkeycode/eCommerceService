/**
 * This middleware file will consists the logic of validating the client who makes call to authenticated APIs , before passing to the controller method.
 * Usually a new user registered to the app using sign up, and thus we save the user info in the db
 * later, when user signin to the app, the user can make REST APIS calls to anyone, but user only get the desired result if the user is authenticated for the authenticated api's, other api's which are open,user can access.
 * For authentication, we using  Acess token/Bearer token .Most commonly used nowadays is JWT(json web token)
 * so when a user signin for the first time, if user is valid user, then the server sent back Access token along with the response.
 * so later instead of again sign in,for the next Api call,user  can use this access token for the next subsequent request.
 * client can send the access token in the request headers by setting
 * x-access-token="x-access token"
 * which can be accesed later by the server
 * thru req.headers[x-access-token]
 */

const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;

/**
 * Logic to validate the access token
 */
const verifyToken = (req, res, next) => {
  //read the token from the header
  let token = req.headers["x-access-token"]; //provided by the client

  if (!token) {
    return res.status(403).send({
      message: "No token provided!", //403 -forbidden status code indicates that the server understood the request but refuses to authorize it.
    });
  }

  //check the validity of the token
  jwt.verify(token, config.secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({
        //401-unauthorised status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource
        message: "Unauthorized!",
      });
    }
    req.userId = decodedToken.id; //reading the user id from the token since it passed as payload during jwt.sign() //jsonwebtoken have 3 parts-header,payload(actual data),signature,and setting it in req object so can be used further
    next();
  });
};

const isAdmin = (req, res, next) => {
  //in the previous middleware, we got the userId and we setted it in the req.userId
  //using that userid , will fetch the user object from the db and check the user type
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          //means the user is admin
          next();
          return;
        }
      }
      //means the user is not admin
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;
