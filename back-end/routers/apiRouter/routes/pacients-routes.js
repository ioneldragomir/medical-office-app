const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Pacients, Employees } = require('../../../tables');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const pacients = await Pacients.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
      });

      return res.status(200).json(pacients);
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { id, password, email } = req.body;

      if (id || !password || !email) {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      if (password.length < 6 || password.length > 32) {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      const emailExists = await Employees.findOne({ where: { email: email } });
      if (emailExists) {
        return res.status(400).json({ error: 'email_taken' });
      }

      req.body.type = 'pacient';
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      req.body.password = hashedPassword;
      await Pacients.create(req.body);

      return res.status(200).json({ success: 'Contul a fost creat.' });
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          return res.status(400).json({ error: 'email_taken' });
        }
      }
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

router
  .route('/portal')
  .post(async (req, res) => {
    try {
      const { id, email } = req.body;

      if (id) {
        return res
          .status(500)
          .json({ error: 'Eroare server... Încercați din nou.' });
      }

      if(email) {
        const emailExists = await Employees.findOne({ where: { email: email } });
        if (emailExists) {
          return res.status(400).json({ error: 'email_taken' });
        }
      }

      req.body.type = 'pacient';
      const pacient = await Pacients.create(req.body);

      delete pacient.dataValues.password;
      delete pacient.dataValues.createdAt;
      delete pacient.dataValues.updatedAt;

      return res.status(200).json(pacient);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          return res.status(400).json({ error: 'email_taken' });
        }
      }
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

router
  .route('/:pacientId')
  .get(async (req, res) => {
    try {
      const pacient = await Pacients.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: { id: req.params.pacientId },
      });

      if (pacient) {
        return res.status(200).json(pacient);
      } else {
        return res.status(404).json({ error: 'Pacientul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .put(async (req, res) => {
    try { 
      const pacient = await Pacients.findByPk(req.params.pacientId);
      if (pacient) {
        const { email } = req.body;

        if(email) {
          const emailExists = await Employees.findOne({
            where: { email: email },
          });
          if (emailExists) {
            return res.status(400).json({ error: 'email_taken' });
          }
        }
        

        if(req.body.password) {
          const hashedPassword = await bcrypt.hash(req.body.password, 12);

          req.body.password = hashedPassword;
        }

        const newPacient = await pacient.update(req.body);

        delete newPacient.dataValues.password;
        delete newPacient.dataValues.createdAt;
        delete newPacient.dataValues.updatedAt;

        return res.status(200).json(newPacient);
      } else {
        return res.status(404).json({ error: 'Pacientul căutat nu există.' });
      }
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors[0].path === 'email') {
          return res.status(400).json({ error: 'email_taken' });
        }
      }
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const pacient = await Pacients.findByPk(req.params.pacientId);
      if (pacient) {
        await pacient.destroy();
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
