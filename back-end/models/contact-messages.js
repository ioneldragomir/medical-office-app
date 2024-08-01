const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ContactMessages = sequelize.define('ContactMessages', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 48],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 52],
      isEmail: true,
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 320],
    },
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  viewed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ContactMessages;
