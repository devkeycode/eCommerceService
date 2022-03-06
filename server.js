const express = require("express");
const bodyParser = require("body-parser");
const serverConfig = require("./configs/server.config");

//initialising the express
const app = express();

//middleware
//body-parser middleware is responsible for parsing the incoming request bodies in a middleware before we handle it

//Parsing the request of the type json and convert that to object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Initialising the db
 */
const db = require("./models");
const Category = db.category;
const Product = db.product;
const Role = db.role;

/**
 * Establishing relation among Category and Product before creating the table
 * Category can have many products
 * Product can belong to one Category
 * 1:Many relationship among Category and Product
 * Product will have extra coulmn indicating categoryId that acts as foreign key here
 * Sequelize automatically create another column named categoryId(since we written Category.hasMany(Product) , it means Product can belong to a particular category , so a categoryId named column will be created in Product table in mysql)
 */
Category.hasMany(Product);

/**
 * Creating  the tables in the database based on the schemas defined
 */
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("table dropped and recreated");
    init(); //calling init function to insert some categories to the database
  })
  .catch((err) => {
    console.log(err.message);
  });

//Initialize the routes
require("./routes/category.routes")(app);
require("./routes/product.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/cart.routes")(app);

//starting the server
app.listen(serverConfig.PORT, () => {
  console.log(`Application started on port no: ${serverConfig.PORT}`);
});

/**
 * This function should be executed at the beginning of the app startup
 */
function init() {
  /**
   * Create some initial categories
   * Bulk insert data in Sequelize
   */
  const categories = [
    {
      name: "Electronics",
      description: "This category will contain all the electronic products",
    },
    {
      name: "KitchenItems",
      description:
        "This category will contain all the Kitchen related products",
    },
  ];

  Category.bulkCreate(categories)
    .then(() => {
      console.log("Categories table is initialized");
    })
    .catch((err) => {
      console.log("Error while initializing categories table");
    });

  /**Create the roles */
  const roles = [
    {
      id: 1,
      name: "user",
    },
    {
      id: 2,
      name: "admin",
    },
  ];

  Role.bulkCreate(roles)
    .then(() => {
      console.log("roles are added");
    })
    .catch((err) => {
      console.log("Error in initialising the categories", categories);
    });
}
