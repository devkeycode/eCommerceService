/**
 * This is the controller file handling product resource
 * This file contains the business logic related to the product resource
 * Everytime any CRUD request come for the product, methods defined in this controller file will be executed.
 */

const db = require("../models"); //requiring the db object which is returned from the index file under the models directory
const Product = db.product; //extracting the product schema object out of db object

/**
 * Handler for create a product
 * POST 127.0.0.1:8080/ecommService/api/v1/products
 * along with JSON body
 */

exports.create = (req, res) => {
  /**
   * Validation of request body
   */
  if (!req.body.name) {
    res.status(400).send({ message: "Name of the product can't be empty!" });
    return;
  }
  if (!req.body.cost) {
    res.status(400).send({ message: "Cost of the product can't be empty!" });
    return;
  }

  //extracting the data from the request body
  const product = {
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
  };

  //Store this product in the db
  Product.create(product)
    .then((product) => {
      console.log(`product name : [ ${product.name}] got inserted in the db`);
      res.status(201).send(product);
    })
    .catch((err) => {
      console.log(
        `Issue in inserting the product name : [ ${product.name}]. Error message : ${err.message}`
      );
      res.status(500).send({
        message: "Some Internal error happened while storing the product!",
      });
    });
};

/**
 * Handler for getting all the products
 * GET 127.0.0.1:8080/ecommService/api/v1/products
 */
exports.findAll = (req, res) => {
  const productName = req.query.name; //extracting the query Param

  let promise;

  if (productName) {
    //this will only be executed if user passed name as queryParam
    promise = Product.findAll({
      where: {
        name: productName,
      },
    });
  } else {
    //this will only be executed if user doesn't passed  queryParam name
    promise = Product.findAll();
  }

  promise
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some Internal error happened while fetching all the products",
      });
    });
};

/**
 * Handler for getting the product based on the id
 *
 * GET 127.0.0.1:8080/ecommService/api/v1/products/:id
 */

exports.findOne = (req, res) => {
  const productId = req.params.id; //extracting the id from req.params

  Product.findByPk(productId)
    .then((productId) => {
      res.status(200).send(productId);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some Internal error while fetching the product based on the given id",
      });
    });
};

/**
 * Handler for updating the products based on the id
 *
 * PUT 127.0.0.1:8080/ecommService/api/v1/products/:id
 * JSON BODY will be passed
 */

exports.update = (req, res) => {
  /**
   * Validation of the request body
   */

  if (!req.body.name) {
    res.status(400).send({
      message: "Name of the product can't be empty !",
    });
    return;
  }

  if (!req.body.cost) {
    res.status(400).send({ message: "Cost of the product can't be empty!" });
    return;
  }

  /**
   * Creation of the product object to be stored in the DB
   */
  const product = {
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
  };

  //identify which product has to be updated by extracting the id from req.params (here id parameter passed with the path)
  const productId = req.params.id;

  //updating the product in the db
  Product.update(product, {
    where: {
      id: productId,
    },
    returning: true,
  })
    .then((updatedproduct) => {
      //to return the updated product ,querying it back from the db
      Product.findByPk(productId)
        .then((productResult) => {
          res.status(200).send(productResult);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              "Some internal error happened while fetching the updated product",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some internal error happened while updating the product",
      });
    });
};

/**
 * Handler for Deleting the product
 * DELETE 127.0.0.1:8080/ecommService/api/v1/products/:id
 */

exports.delete = (req, res) => {
  const productId = req.params.id;

  Product.destroy({
    where: {
      id: productId,
    },
  })
    .then((result) => {
      res.status(200).send({
        message: "Successfully deleted the product",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some internal error happened while deleting the product based on the id",
      });
    });
};
