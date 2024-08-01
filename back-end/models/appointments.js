const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Appointments = sequelize.define('Appointments', {
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
        len: [1,48],
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        len: [10,10],
        is: /^[0-9]*$/,
    }
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    validate: {
        len: [1,320],
    }
  },
  status: {
    type: DataTypes.ENUM('programat', 'confirmat', 'prezentat', 'neprezentat'),
    allowNull: false,
  },
  file: DataTypes.BLOB,
  appointmentFile: DataTypes.BLOB
});

module.exports = Appointments;