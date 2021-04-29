const Sequelize = require("sequelize");
const config = require("config");
const dbUrl = require("../../config/default.json");

const sequelize = new Sequelize(dbUrl.database, dbUrl.user, dbUrl.password, {
  host: dbUrl.host,
  dialect: "mysql",
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

module.exports = sequelize;
global.sequelize = sequelize;
