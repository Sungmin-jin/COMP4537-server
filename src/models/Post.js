const Sequelize = require("sequelize");

module.exports = sequelize.define("post", {
  postId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: Sequelize.STRING(500),
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  isSold: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  postDate: {
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  img: {
    type: Sequelize.STRING(300),
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(11),
    references: {
      model: "User",
      key: "userId",
    },
  },
});
