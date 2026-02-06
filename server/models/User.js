const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  picture: {
    type: DataTypes.STRING
  },
  refreshToken: {
    type: DataTypes.TEXT 
  }
});
module.exports = User;