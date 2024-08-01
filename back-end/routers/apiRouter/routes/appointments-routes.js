const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

const { Appointments } = require('../../../tables');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const { pacientId, doctorId } = req.query;
      const appointments = await Appointments.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
          [Op.and]: [
            pacientId ? { pacientId: pacientId } : undefined,
            doctorId ? { doctorId: doctorId } : undefined,
          ],
        },
      });

      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { id } = req.body;

      if (id) {
        return res
          .status(500)
          .json({
            error:
              'Eroare server... Încercați din nou.',
          });
      }

      req.body.status = 'programat';
      const appointment = await Appointments.create(req.body);

      delete appointment.dataValues.createdAt;
      delete appointment.dataValues.updatedAt;

      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

  router
  .route('/:appointmentId')
  .get(async (req, res) => {
    try {
      const appointment = await Appointments.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        where: { id: req.params.appointmentId },
      });

      if (appointment) {
        return res.status(200).json(appointment);
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .put(async (req, res) => {
    try {
      const appointment = await Appointments.findByPk(req.params.appointmentId);
      if (appointment) {   
        delete req.body.file;
        const newAppointment = await appointment.update(req.body);

        delete newAppointment.dataValues.createdAt;
        delete newAppointment.dataValues.updatedAt;

        return res.status(200).json(newAppointment);
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const appointment = await Appointments.findByPk(req.params.appointmentId);
      if (appointment) {
        await appointment.destroy();
        return res
          .status(200)
          .json({ success: 'Programarea a fost ștersă cu succes.' });
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });


module.exports = router;
