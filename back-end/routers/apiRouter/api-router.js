const express = require('express');
const router = express.Router();

router.use('/contact', require('./routes/contact-messages-routes'))
router.use('/pacients', require('./routes/pacients-routes'))
router.use('/employees', require('./routes/employees-routes'))
router.use('/appointments', require('./routes/appointments-routes'))
router.use('/file', require('./routes/file-routes'))
router.use('/appointment_file', require('./routes/appointment-file-routes'))

module.exports = router;
