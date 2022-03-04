/**
 * This file will contain the REST URIs realted to product resource mapping with the controllers
 * This file will be responsible for routing the requests to the
 * correct controller method
 * This file will contain the routes logic for the product resource
 * and will export it.
 */

const controller = require("../controllers/product.controller");

module.exports = function (app) {
  //Route for creating a new product
  app.post("/ecommService/api/v1/products", controller.create);

  //Route for getting all the products
  //Also this is the Route for getting the product based on the name - filter the result based on the name
  app.get("/ecommService/api/v1/products", controller.findAll);

  //Route for getting the product based on the product id
  app.get("/ecommService/api/v1/products/:id", controller.findOne);

  //Route for updating the product
  app.put("/ecommService/api/v1/products/:id", controller.update);

  //Route for deleting the product
  app.delete("/ecommService/api/v1/products/:id", controller.delete);
};
