const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Pacients = sequelize.define('Pacients', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [1, 52],
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 24],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 24],
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 10],
      is: /^[0-9]*$/,
    },
  },
  type: {
    type: DataTypes.ENUM('pacient'),
    allowNull: false,
  },
  passResetCode: DataTypes.STRING
});

module.exports = Pacients;
