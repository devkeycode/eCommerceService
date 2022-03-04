/**
 * This file will contain the REST URIs realted to category resource mapping with the controllers
 * This file will be responsible for routing the requests to the
 * correct controller method
 * This file will contain the routes logic for the Category resource
 * and will export it.
 */

const controller = require("../controllers/category.controller");
const { requestValidator } = require("../middlewares");

module.exports = function (app) {
  //Route for creating a new category
  app.post(
    "/ecommService/api/v1/categories",
    [requestValidator.validateCategoryRequest],
    controller.create
  );

  //Route for getting all the categories
  //Also this is the Route for getting the category based on the name - filter the result based on the name
  app.get("/ecommService/api/v1/categories", controller.findAll);

  //Route for getting the category based on the category id
  app.get("/ecommService/api/v1/categories/:id", controller.findOne);

  //Route for updating the category
  app.put(
    "/ecommService/api/v1/categories/:id",
    [requestValidator.validateCategoryRequest],
    controller.update
  );

  //Route for deleting the category
  app.delete("/ecommService/api/v1/categories/:id", controller.delete);
};
