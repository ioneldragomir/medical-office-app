const express = require('express');
const router = express.Router();
const multer = require ('multer')
const { Appointments } = require('../../../tables');

const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/:appointmentId')
  .get(async (req, res) => {
    try {
      const appointment = await Appointments.findByPk(req.params.appointmentId);
      if (appointment) {   
        return res.status(200).json(appointment.file);
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .post(upload.single("file"), async (req, res) => {
    try {
      const file = req.file;

      if(!file) {
        res.json({error: 'error'})
      }

      const appointment = await Appointments.findByPk(req.params.appointmentId);
      if (appointment) {   
        appointment.file= file.buffer;
        const updatedAppointment = await appointment.save();

        return res.status(200).json(updatedAppointment);
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const appointment = await Appointments.findByPk(req.params.appointmentId);
      if (appointment) {   
        appointment.file= null;
        const updatedAppointment = await appointment.save();

        return res.status(200).json(updatedAppointment);
      } else {
        return res.status(404).json({ error: 'Programarea căutat nu există.' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })


module.exports = router;
