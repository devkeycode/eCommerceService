/**
 * This is the controller file handling category resource
 * This file contains the business logic related to the category resource
 * Everytime any CRUD request come for the Category, methods defined in this controller file will be executed.
 */

const db = require("../models"); //requiring the db object which is returned from the index file under the models directory
const Category = db.category; //extracting the Category schema object out of db object

/**
 * Handler for create a Category
 * POST 127.0.0.1:8080/ecommService/api/v1/categories
 * along with JSON body
 */

exports.create = (req, res) => {
  /**
   * Validation of request body
   */
  if (!req.body.name) {
    res.status(400).send({ message: "Name of the category can't be empty!" });
    return;
  }
  //in validation of request body, only checking name, since in the category schema, we defined it as allowNull to false, means it is mandatory a category must have name, but description in the category schema, we haven't define (set explicitly) allowNull to false , which means it set by default to allowNull to true.

  //extracting the data from the request body
  const category = {
    name: req.body.name,
    description: req.body.description,
  };
  //Store this category in the db
  Category.create(category)
    .then((category) => {
      console.log(`category name : [ ${category.name}] got inserted in the db`);
      res.status(201).send(category);
    })
    .catch((err) => {
      console.log(
        `Issue in inserting the category name : [ ${category.name}]. Error message : ${err.message}`
      );
      res.status(500).send({
        message: "Some Internal error happened while storing the category!",
      });
    });
};

/**
 * Handler for getting all the categories
 * GET 127.0.0.1:8080/ecommService/api/v1/categories
 */
exports.findAll = (req, res) => {
  //suppporting the queryParam , queryParam are the ones followed by ? in the URI, example ?name=Electronics

  const categoryName = req.query.name; //extracting the query Param

  let promise;

  if (categoryName) {
    //this will only be executed if user passed name as queryParam
    promise = Category.findAll({
      where: {
        name: categoryName,
      },
    });
  } else {
    //this will only be executed if user doesn't passed  queryParam name
    promise = Category.findAll();
  }

  promise
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some Internal error happened while fetching all the categories",
      });
    });
};

/**
 * Handler for getting the category based on the id
 *
 * GET 127.0.0.1:8080/ecommService/api/v1/categories/:id
 */

exports.findOne = (req, res) => {
  const categoryId = req.params.id; //extracting the id from req.params

  Category.findByPk(categoryId)
    .then((categoryId) => {
      res.status(200).send(categoryId);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some Internal error while fetching the category based on the given id",
      });
    });
};

/**
 * Handler for updating the categories based on the id
 *
 * PUT 127.0.0.1:8080/ecommService/api/v1/categories/:id
 * JSON BODY will be passed
 */

exports.update = (req, res) => {
  /**
   * Validation of the request body
   */

  if (!req.body.name) {
    res.status(400).send({
      message: "Name of the category can't be empty !",
    });
    return;
  }

  /**
   * Creation of the Category object to be stored in the DB
   */
  const category = {
    name: req.body.name,
    description: req.body.description,
  };

  //identify which Category has to be updated by extracting the id from req.params (here id parameter passed with the path)
  const categoryId = req.params.id;

  //updating the category in the db
  Category.update(category, {
    where: {
      id: categoryId,
    },
    returning: true,
  })
    .then((updatedCategory) => {
      //to return the updated category ,querying it back from the db
      Category.findByPk(categoryId)
        .then((categoryResult) => {
          res.status(200).send(categoryResult);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              "Some internal error happened while fetching the updated category",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some internal error happened while updating the category",
      });
    });
};

/**
 * Handler for Deleting the category
 * DELETE 127.0.0.1:8080/ecommService/api/v1/categories/:id
 */

exports.delete = (req, res) => {
  const categoryId = req.params.id;

  Category.destroy({
    where: {
      id: categoryId,
    },
  })
    .then((result) => {
      // console.log(result); //result will return 1 if successfully deleted and 0 if not succeded
      res.status(200).send({
        message: "Successfully deleted the category",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some internal error happened while deleting the category based on the id",
      });
    });
};
