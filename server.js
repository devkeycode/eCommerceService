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
require("./routes/category.route")(app);

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
}
