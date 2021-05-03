const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = sequelize.define("chat", {
  chatId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  chatRoomId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: "chatRoom",
      key: "chatRoomId",
    },
  },
  chatText: {
    type: Sequelize.STRING("300"),
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: "user",
      key: "userId",
    },
  },
  chatDate: {
    type: "TIMESTAMP",
    defaultValue: moment().format("YYYY-MM-DDTHH:mm:s:ss") + ".000Z",
  },
});
