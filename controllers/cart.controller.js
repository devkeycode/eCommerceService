/**
 * This is the controller file handling cart resource
 * This file contains the business logic related to the cart resource
 * Everytime any CRUD request come for the cart, methods defined in this controller file will be executed.
 */
const db = require("../models");
const Product = db.product;
const Cart = db.cart;
const Op = db.Sequelize.Op;

/**
 * Create and save a new Cart
 */
exports.create = (req, res) => {
  //we will not be passing anything in req.body here , since userId is asccociated with the user who sign in and send that acesstoken with the request
  const cart = {
    userId: req.userId, //get this from middleware( verifyToken) since we have setup userId in req object once the user passed token is verified
  };

  // extracting the items from the request body
  // const itemIds = req.body.items;
  Cart.create(cart)
    .then((cart) => {
      //here cart obj we will be getting from the db, will have id and userId as keys
      res.status(201).send(cart);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: "Some internal server error happened",
      });
    });
};

/**
 * Update a given cart by adding more item to it
 * here in req.body will be having array of product Ids like [1,2,3]
 * req.body will be {productIds: [1,2,3]}
 *
 * 127.0.0.1:8080/eCommService/v1/api/carts/123
 */
exports.update = (req, res) => {
  //figure out of the cart if its present ,which need to be updated
  const cartId = req.params.id;

  Cart.findByPk(cartId).then((cart) => {
    console.log(cart);

    //add the products passed in the request body to the cart
    //in rquest body, user will be passing an array consiting of productids in it
    const productIds = req.body.productIds; //it is an array here

    //find all the products with the given ids
    Product.findAll({
      where: {
        id: productIds, //internally sequelize will put Or here
      },
    }).then((items) => {
      if (!items) {
        res.status(400).send({
          message: "item trying to be added doesn't exist",
        });
      }

      //set these products inside the cart
      cart.setProducts(items).then(() => {
        console.log("Products successfully added in the cart");
        //take care of cost part
        let cost = 0;
        const productsSelected = [];
        cart.getProducts().then((products) => {
          for (let i = 0; i < products.length; i++) {
            cost = cost + products[i].cost;
            productsSelected.push({
              id: products[i].id,
              name: products[i].name,
              cost: products[i].cost,
            });
          }
          //return the cart updated response
          res.status(200).send({
            id: cart.id,
            productsSelected: productsSelected,
            cost: cost,
          });
        });
      });
    });
  });
};

/**
 * Controller to get the cart based on the cartId
 */
exports.getCart = (req, res) => {
  const cartId = req.params.cartId;
  Cart.findByPk(cartId).then((cart) => {
    let cost = 0;
    const productsSelected = [];
    cart.getProducts().then((products) => {
      for (i = 0; i < products.length; i++) {
        cost = cost + products[i].cost;
        productsSelected.push({
          id: products[i].id,
          name: products[i].name,
          cost: products[i].cost,
        });
      }

      res.status(200).send({
        id: cart.id,
        productsSelected: productsSelected,
        cost: cost,
      });
    });
  });
};
