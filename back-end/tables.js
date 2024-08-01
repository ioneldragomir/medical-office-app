const { DataTypes } = require('sequelize');

const ContactMessages = require('./models/contact-messages');
const Pacients = require('./models/pacients');
const Employees = require('./models/employees');
const Appointments = require('./models/appointments');

Employees.hasMany(Appointments, {
  foreignKey: {
    name: 'doctorId',
    type: DataTypes.UUID,
    allowNull: false
  }
});

Pacients.hasMany(Appointments, {
  foreignKey: {
    name: 'pacientId',
    type: DataTypes.UUID
  }
});

module.exports = { ContactMessages, Pacients, Employees, Appointments };
