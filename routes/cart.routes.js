/**
 * This file will contain the REST URIs realted to cart resource mapping with the controllers
 * This file will be responsible for routing the requests to the
 * correct controller method
 * This file will contain the routes logic for the cart resource
 * and will export it.
 */

const orderController = require("../controllers/cart.controller");
const { authJwt, requestValidator } = require("../middlewares");

module.exports = function (app) {
  //Route for the POST request to create the cart
  app.post(
    "/ecommService/api/v1/carts",
    [authJwt.verifyToken],
    orderController.create
  );

  //Route for the PUT request to create the product
  app.put(
    "/ecommService/api/v1/carts/:id",
    [authJwt.verifyToken],
    orderController.update
  );

  //Route for the GET request to get the product
  app.get(
    "/ecommService/api/v1/carts/:cartId",
    [authJwt.verifyToken],
    orderController.getCart
  );
};
