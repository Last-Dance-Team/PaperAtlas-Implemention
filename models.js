const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const FeedbackSchema = sequelize.define("feedback", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.INTEGER,
  },
  surname: {
    type: DataTypes.STRING,
  },  
  point: {
    type: DataTypes.INTEGER,
  },
  message: {
    type: DataTypes.STRING,
  },
  mail: {
    type: DataTypes.STRING,
  },
});

exports.Feedback = sequelize.model("feedback", FeedbackSchema);