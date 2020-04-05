'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id:{
        type: Sequelize.INTEGER(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name:{
          type: Sequelize.STRING(),
          allowNull: false,
          validate: {
              len: {
                  args: [4,30],
                  msg: "Please Enter a name with at Least 4 chars but no more than 30"
              }
          }
      },
      email:{
          type: Sequelize.STRING(),
          allowNull: false,
          unique: true
      },
      password:{
          type: Sequelize.STRING(),
          allowNull: false,
          validate: {
              len: {
                  args: [6,14],
                  msg: "Please Enter a name with at Least 6 chars but no more than 14"
              }
          }
      },
      country_id: {
        type: Sequelize.INTEGER(),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users")
  }
};
