/**
 * This controller file will be  used for the authentication and authorization
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op; //Sequleize provides the operator

const config = require("../configs/auth.config");

/**
 * Handler for signup
 */
exports.signup = (req, res) => {
  //read the request body and create user object
  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8), //need to encypt this password
  };

  //persist this user obejct to the db
  User.create(userObj).then((user) => {
    console.log("User created");

    //need  to provide correct role to the user
    //but beofre that,need to have roles defined in the db before means when the server started, the db must have some predefined roles, so a user can assign the roles during sign up
    if (req.body.roles) {
      //need to check if the roles given in the request body is valid role(i.e. exists in the db or not)
      Role.findAll({
        where: {
          name: {
            //where name in [1,2,3]
            //or where name =1 or name=2 or name=3
            [Op.or]: req.body.roles, //array of roles
          },
        },
      }).then((roles) => {
        //user object will have setRoles method
        //set theses roles with the user
        //setRoles method takes an object as an argument
        // console.log(User);
        user
          .setRoles(roles)
          .then(() => {
            console.log("Registration completed");
            res.status(201).send({ message: "User successfully registered" });
          })
          .catch((err) => {
            console.log("Error while registring user");
            res.status(500).send({ message: "some internal error occured" });
          });
      });
    } else {
      /** 
       * //one option
      Role.findOne({
        where: {
          name: "customer",
        },
      }).then((roles) => {
        //set theses roles with the user
        //setRoles method
        user.setRoles([roles]).then(() => {
          console.log("Registration completed");
          res.status(201).send({ message: "User successfully registered" });
        });
      });
      */
      //primarykey reprsent a resource ,,primaryKey iteslf represent whole object
      //and since we know primarykey of role customer is 1
      user
        .setRoles([1])
        .then(() => {
          console.log("registation completed");
          res.status(201).send({
            message: "User successfully registered",
          });
        })
        .catch((err) => {
          console.log("Error while registring user");
          res.status(500).send({ message: "some internal error occured" });
        });
    }
  });
};

/**
 * Hnadler for signin
 */

exports.signin = (req, res) => {
  //check if user exists
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }

      //verify the password
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Invalid password" });
      }

      /**
       * need to generate the access token
       *
       */
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, //24 hours  i.e. 86400seconds time to live ttl//this again we could have kept in config file
        // expiresIn: 300, //300seconds time to live ttl//this again we could have kept in config file
      });

      /**
       * need to provide the roles assigned to the user in the resposne
       */
      let authorities = [];
      user.getRoles().then((roles) => {
        // console.log(roles);
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      console.log("Internal error occured");
      res.status(500).send({ message: "Some internal error happened" });
    });
};
