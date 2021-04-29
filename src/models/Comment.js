const Sequelize = require("sequelize");

module.exports = sequelize.define("comment", {
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
      model: "user",
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
