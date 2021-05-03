const Sequelize = require("sequelize");

module.exports = sequelize.define("chatRoom", {
  chatRoomId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
  },
  userOne: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: "user",
      key: "userId",
    },
  },
  userTwo: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: "user",
      key: "userId",
    },
  },
  chatRoomDate: {
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
