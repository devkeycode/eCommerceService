/**
 * This file contain Category schema
 * Category has id,name,description as fields
 * if we didn't specify the id in the category schema,sequelize will automatically create that.
 *
 *  Category Schema object being created will be exported to be used by other modules
 */

/**
 *
 * @param sequelize -- represents the db connection object
 * @param  Sequelize --represents the Sequelize class form sequelize library
 * @return Category Schema
 */

module.exports = (sequelize, Sequelize) => {
  //Defining the Category Schema inside this function and returning it.
  const Category = sequelize.define(
    "category",
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
    },
    {
      tableName: "categories", //can explicitly passed tableName if we want to give it ,by default table name in the database take plural name of the schema we defined.
      //If above is not provided, model name is converted into plural and set as the table name
      //If we want to just use the model name provided, we can provide the below option : freezeTableName: true
    }
  );

  return Category;
};
