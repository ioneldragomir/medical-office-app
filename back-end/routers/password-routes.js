const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');
// const generator = require('generate-password');
// const { Pacients, Employees } = require('../tables');

// *** NOT USED ANYMORE ***
// const CLIENT_ID =
//   'client_id';
// const CLIENT_SECRET = 'client_secret';
// const REDIRECT_URI = 'redirect_uri';
// const REFRESH_TOKEN = 'refresh_token';

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// router.route('/generate').post(async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res
//         .status(500)
//         .json({ error: 'Eroare server... Încercați din nou.' });
//     }

//     let user = await Pacients.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       user = await Employees.findOne({
//         where: {
//           email: email,
//         },
//       });
//     }

//     if (user) {
//       const accessToken = await oAuth2Client.getAccessToken();

//       const transport = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           type: 'OAuth2',
//           user: 'user',
//           clientId: CLIENT_ID,
//           clientSecret: CLIENT_SECRET,
//           refreshToken: REFRESH_TOKEN,
//           accessToken: accessToken,
//         },
//       });

//       const code = generator.generate({
//         length: 12,
//         numbers: true,
//       });

//       const mailOptions = {
//         from: 'SUPORT LICENTA <user>',
//         to: email,
//         subject: 'Resetare parola cont',
//         text: `Codul pentru resetarea parolei: ${code}`,
//       };

//       await transport.sendMail(mailOptions);

//       user.passResetCode = code;
//       await user.save();

//       return res.status(200).json({
//         success: 'Codul pentru resetarea parolei a fost trimis pe email.',
//       });
//     } else {
//       res.status(401).json({ error: 'email_not_found' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Eroare server... Încercați din nou.' });
//   }
// });

// router.route('/reset').post(async (req, res) => {
//   try {
//     const { code, email, password } = req.body;

//     if (!code || !email || !password) {
//       return res
//         .status(500)
//         .json({ error: 'Eroare server... Încercați din nou.' });
//     }

//     let user = await Pacients.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       user = await Employees.findOne({
//         where: {
//           email: email,
//         },
//       });
//     }

//     if (user) {
//       if (code === user.passResetCode) {
//         const hashedPassword = await bcrypt.hash(password, 12);

//         user.password = hashedPassword;
//         await user.save();

//         return res.status(200).json({
//           success: 'Parola a fost resetată cu success',
//         });
//       } else {
//         res.status(401).json({ error: 'code_mismatch' });
//       }
//     } else {
//       res.status(500).json({ error: 'Eroare server... Încercați din nou.' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Eroare server... Încercați din nou.' });
//   }
// });

module.exports = router;
