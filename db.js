const { Sequelize } = require("sequelize");
require('dotenv').config()
const password = process.env.FEEDBACK_DB_PASSWORD;
const host = process.env.HOST;
const sqlType = process.env.SQL_TYPE;
const sequelize = new Sequelize(sqlType, sqlType, password, {
  host: host,
  dialect: sqlType,
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;


