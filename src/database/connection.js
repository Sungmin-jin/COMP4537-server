const Sequelize = require("sequelize");
const config = require("config");
const urls = require("../../config/default.json");
const dbUrl = urls.sqlURI;
console.log(dbUrl);

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
