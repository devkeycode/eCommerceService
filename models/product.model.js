/**
 * This file contain Product schema
 * Product has id,name,description,cost as fields
 * if we didn't specify the id in the Product schema,sequelize will automatically create that.
 *
 *  Product Schema object being created will be exported to be used by other modules
 */

/**
 *
 * @param sequelize -- represents the db connection object
 * @param  Sequelize --represents the Sequelize class form sequelize library
 * @return Product Schema
 */

module.exports = (sequelize, Sequelize) => {
  //Defining the Product Schema inside this function and returning it.
  const Product = sequelize.define(
    "product",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "products", //can explicitly passed tableName if we want to give it ,by default table name in the database take plural name of the schema we defined.
      //If above is not provided, model name is converted into plural and set as the table name
      //If we want to just use the model name provided, we can provide the below option : freezeTableName: true
    }
  );

  return Product;
};
