/**
 * This is the controller file handling product resource
 * This file contains the business logic related to the product resource
 * Everytime any CRUD request come for the product, methods defined in this controller file will be executed.
 */

const db = require("../models"); //requiring the db object which is returned from the index file under the models directory
const Product = db.product; //extracting the product schema object out of db object
const Category = db.category; //extracting the category schema object out of db object
const Op = db.Sequelize.Op;
/**
 * Handler for create a product
 * POST 127.0.0.1:8080/ecommService/api/v1/products
 * along with JSON body
 */

exports.create = (req, res) => {
  /**
   * Validation of request body
   */
  /*
   //since validation of request body is now done in middleware itself before request arrived at controller function, so no need to check in controller function
  if (!req.body.name) {
    res.status(400).send({ message: "Name of the product can't be empty!" });
    return;
  }
  if (!req.body.cost) {
    res.status(400).send({ message: "Cost of the product can't be empty!" });
    return;
  }
  */
  //extracting the data from the request body
  const product = {
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
    categoryId: req.body.categoryId, //categoryId added to link product with a category
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
  //Supporting the query param
  let productName = req.query.name;
  let minCost = req.query.minCost;
  let maxCost = req.query.maxCost;
  let promise;
  if (productName) {
    promise = Product.findAll({
      where: {
        name: productName,
      },
    });
  } else if (minCost && maxCost) {
    promise = Product.findAll({
      where: {
        cost: {
          [Op.gte]: minCost,
          [Op.lte]: maxCost,
        },
      },
    });
  } else if (minCost) {
    promise = Product.findAll({
      where: {
        cost: {
          [Op.gte]: minCost,
        },
      },
    });
  } else if (maxCost) {
    promise = Product.findAll({
      where: {
        cost: {
          [Op.lte]: maxCost,
        },
      },
    });
  } else {
    promise = Product.findAll();
  }

  promise
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some Internal error while fetching all the products",
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
    .then((product) => {
      res.status(200).send(product);
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
  /* 
  //since validation of request body is now done in middleware itself before request arrived at controller function, so no need to check in controller function
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
  */

  /**
   * Creation of the product object to be stored in the DB
   */
  const product = {
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
    categoryId: req.body.categoryId,
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

/**
 * Handler for  getting list of products under a specific category
 * GET 127.0.0.1:8080/ecommService/api/v1/categories/:categoryId/products
 */

exports.getProductsUnderCategory = (req, res) => {
  const categoryId = parseInt(req.params.categoryId);

  Product.findAll({
    where: {
      categoryId: categoryId,
    },
  })
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some Internal error while fetching  products based on the category id ",
      });
    });
};
