/**
 * This file contain Cart schema
 * Cart has id,cost as fields
 * if we didn't specify the id in the Cart schema,sequelize will automatically create that.
 *
 *  Cart Schema object being created will be exported to be used by other modules
 */

/**
 *
 * @param sequelize -- represents the db connection object
 * @param  Sequelize --represents the Sequelize class form sequelize library
 * @return Cart Schema
 */

module.exports = (sequelize, Sequelize) => {
  //Defining the Cart Schema inside this function and returning it.
  const Cart = sequelize.define("cart", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cost: {
      type: Sequelize.INTEGER,
    },
  });

  return Cart;
};
