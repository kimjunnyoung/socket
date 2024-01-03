const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.define('User', {
  userNickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RoomId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  socketId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
});

module.exports = User;
