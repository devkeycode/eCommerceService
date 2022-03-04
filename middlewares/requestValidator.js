/**
 * This file will consists the logic of validating the incoming requests bodies
 */
const db = require("../models");
const Category = db.category;
/**
 * Validate the request body for categories
 */

const validateCategoryRequest = (req, res, next) => {
  // Check for the name
  if (!req.body.name) {
    res.status(400).send({
      message: "Name of the category is not provided",
    });
    return;
  }

  /* 
  //will not check for description since we made description as null allowed, so its not mandatory to give description in req.body
  //Check for the description
  if (!req.body.description) {
    res.status(400).send({
      message: "Description of the category is not provided",
    });
    return;
  }
  */

  //if the validation passed , means it is a valid request having valid body, so just call the next middleware in the request process pipeline
  next();
};

/***
 * Validate the request body for Product
 */
const validateProductRequest = (req, res, next) => {
  // Check for the name
  if (!req.body.name) {
    res.status(400).send({
      message: "Name of the Product is not provided",
    });
    return;
  }

  /* //no check on description,since we allowed null also in schema
  //Check for the description
  if (!req.body.description) {
    res.status(400).send({
      message: "Description of the Product is not provided",
    });
    return;
  }
  */

  //Check for the cost
  if (!req.body.cost || req.body.cost <= 0) {
    res.status(400).send({
      message: "Cost of the Product is not provided",
    });
    return;
  }

  //check for categoryId
  if (!req.body.categoryId) {
    res.status(400).send({
      message: "Category Id is not provided",
    });
    return;
  } else {
    //check if its valid value
    Category.findByPk(req.body.categoryId)
      .then((category) => {
        if (!category) {
          res.status(400).send({
            message: "Category Id is not valid",
          });
          return;
        }
        //if both the validation passed , means it is a valid request having valid body, so just call the next middleware in the line and the next middleware in the line is controller
        next();
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some Internal error while storing the product!",
        });
        return;
      });
  }
};

/**
 * Validate CategoryId that has passed as req param
 * for example in
 * 127.0.0.1:8080/ecommService/api/v1/categories/:categoryId/products
 */
const validateCategoryPassedInReqParam = (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);
  if (categoryId) {
    //Check if the category exists, if not return the proper error message
    Category.findByPk(categoryId)
      .then((category) => {
        if (!category) {
          res.status(400).send({
            message: `category id passed is not available : ${categoryId}`,
          });
          return;
        }
        //if it is a valid categoryId, means further can go in request processing pipeline
        next();
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some Internal error while accessing the product!",
        });
        return;
      });
  } else {
    res.status(400).send({
      message: `category id passed is not available `,
    });
    return;
  }
};

module.exports = {
  validateProductRequest: validateProductRequest,
  validateCategoryRequest: validateCategoryRequest,
  validateCategoryPassedInReqParam: validateCategoryPassedInReqParam,
};
