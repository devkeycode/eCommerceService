/**
 * This file will consists logic of validating the incoming requests bodies during signup
 */

const db = require("../models");
const User = db.user;
// const Role = db.role;
const ROLES = db.ROLES;
// const Op = db.Sequelize.Op;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  //check for the username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! username already exists",
      });
      return;
    }
    //means it is valid username (unique) , so now check for email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed!email already exists",
        });
        return;
      }
      //means it is valid email also, so  all validation passed
      next();
    });
  });
};

/**
 * Validation for correct roles
 */
const checkInputRolesValid = (req, res, next) => {
  if (req.body.roles) {
    console.log(req.body.roles);
    //roles given by the user, so need to verify whether the user provided valid roles or not
    for (let i = 0; i < req.body.roles.length; i++) {
      console.log(ROLES);
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Roles you  provided - ${req.body.roles[i]} is not a valid role.`,
        });
        return;
      }
    }
  }
  next();
};
/* //other approach expenisve since everytime we are querying for role in db
    Role.findAll()
      .then((roles) => {
        // console.log("roles **************", roles);
        const validCategoryNames = [];
        for (let i = 0; i < roles.length; i++) {
          validCategoryNames.push(roles[i].dataValues.name);
        }
        //now check if roles provided in req.body is in this validCategoryNames or not
        if (!validCategoryNames.includes(...req.body.roles)) {
          //means something user provided as role is not a valid role so return
          res
            .status(400)
            .send({ message: "Roles you  provided is not a valid role." });
          return;
        } else {
          //means it is valid, so pass to the next
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some internal occur happend");
        return;
      });
      
  } else {
    //in case no roles provided by the user, so no validation needed here
    next();
  }
  */

/**
 * Validate if the username and email is valid format or not
 */
const checkInputInValidFormat = (req, res, next) => {
  //check whether the username provided or not
  if (!req.body.username) {
    res.status(400).send({
      message:
        "Username must be provided to signup and username can't be empty",
    });
    return;
  }
  //check whether the email provided or not
  if (!req.body.email) {
    res.status(400).send({
      message: "Email must be provided to signup and email can't be empty",
    });
    return;
  }
  //check whether the password provided or not
  if (!req.body.password) {
    res.status(400).send({
      message:
        "Password must be provided to signup  and password can't be empty",
    });
    return;
  }
  //check username cant be empty //this done by !req.body.username
  // if (req.body.username.length === 0) {
  //   res.status(400).send({ message: "Username can't be empty" });
  //   return;
  // }
  //check email
  if (!req.body.email.includes("@")) {
    res.status(400).send({ message: "Provide a valid email address." });
    return;
  }
  //check password using regex
  let regexPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,12}$/;
  if (
    !regexPattern.test(req.body.password) ||
    /^(?=.*\s)/.test(req.body.password)
  ) {
    res.status(400).send({
      message:
        "Passsword must have at least one lowercase character ,at least one uppercase character ,at least one digit and must not contain any whitespaces and also must be 8-12 characters long",
    });
    return;
  }

  //if all validation passed
  next();
};

module.exports = {
  checkInputInValidFormat,
  checkDuplicateUsernameOrEmail,
  checkInputRolesValid,
};
