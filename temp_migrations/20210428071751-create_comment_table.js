"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("comment", {
      commentId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      commentText: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      commentDate: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
      },
      postId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: "post",
          key: "postId",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("comment");
  },
};
