const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Employees, Pacients } = require('../../../tables');

router
  .route('/')
  .get(async (req, res) => {
    const { type, specialty } = req.query;
    try {
      const employees = await Employees.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: {
          [Op.and]: [
            type ? { type: type } : undefined,
            specialty ? { specialty: specialty } : undefined,
          ],
        },
      });

      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { id, type, password, email } = req.body;
      if (id || !email) {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      if (type !== 'doctor' && type !== 'receptionist' && type !== 'admin') {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      if (password.length < 6 || password.length > 32) {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      const emailExists = await Pacients.findOne({ where: { email: email } });
      if (emailExists) {
        return res.status(400).json({ error: 'email_taken' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      req.body.password = hashedPassword;

      const employee = await Employees.create(req.body);

      delete employee.dataValues.password;
      delete employee.dataValues.createdAt;
      delete employee.dataValues.updatedAt;

      return res.status(200).json(employee);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          return res.status(400).json({ error: 'email_taken' });
        } else if (error.errors[0].path === 'cnp') {
          return res.status(400).json({ error: 'cnp_taken' });
        } else {
          return res.status(400).json({ error: 'parafa_taken' });
        }
      }
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

router
  .route('/:employeeId')
  .get(async (req, res) => {
    try {
      const employee = await Employees.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: { id: req.params.employeeId },
      });

      if (employee) {
        return res.status(200).json(employee);
      } else {
        return res.status(404).json({ error: 'Angajatul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .put(async (req, res) => {
    try {
      const { type, email } = req.body;

      const employee = await Employees.findByPk(req.params.employeeId);
      if (employee) {
        if (type !== 'doctor' && type !== 'receptionist' && type !== 'admin') {
          return res.status(500).json({
            error: 'Eroare server... Încercați din nou.',
          });
        }

        if (!email) {
          return res
            .status(500)
            .json({ error: 'Eroare server... Încercați din nou.' });
        }

        const emailExists = await Pacients.findOne({ where: { email: email } });
        if (emailExists) {
          return res.status(400).json({ error: 'email_taken' });
        }

        if (req.body.password) {
          const hashedPassword = await bcrypt.hash(req.body.password, 12);

          req.body.password = hashedPassword;
        }

        const newEmployee = await employee.update(req.body);

        delete newEmployee.dataValues.password;
        delete newEmployee.dataValues.createdAt;
        delete newEmployee.dataValues.updatedAt;

        return res.status(200).json(newEmployee);
      } else {
        return res.status(404).json({ error: 'Pacientul căutat nu există.' });
      }
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          return res.status(400).json({ error: 'email_taken' });
        } else if (error.errors[0].path === 'cnp') {
          return res.status(400).json({ error: 'cnp_taken' });
        } else {
          return res.status(400).json({ error: 'parafa_taken' });
        }
      }
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const employee = await Employees.findByPk(req.params.employeeId);
      if (employee) {
        await employee.destroy();
        return res
          .status(200)
          .json({ success: 'Contul a fost șters cu succes.' });
      } else {
        return res.status(404).json({ error: 'Contul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

module.exports = router;
