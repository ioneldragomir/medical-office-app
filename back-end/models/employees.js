const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Employees = sequelize.define('Employees', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 52],
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
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
  cnp: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [13, 13],
    },
  },
  parafa: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [6, 6],
    },
  },
  hierarchy: {
    type: DataTypes.ENUM('generalist', 'rezident', 'specialist', 'primar'),
  },
  employmentDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 72],
    },
  },
  education: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 42],
    },
  },
  specialty: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 42],
    },
  },
  experience: {
    type: DataTypes.NUMBER,
  },
  type: {
    type: DataTypes.ENUM('doctor', 'receptionist', 'admin'),
    allowNull: false,
  },
  passResetCode: DataTypes.STRING
});

module.exports = Employees;
