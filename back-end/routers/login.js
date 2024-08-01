const express = require('express');
const router = express.Router();
const { Employees, Pacients } = require('../tables');
const bcrypt = require('bcrypt');

router.route('/').post(async (req, res) => {
  try {
    const credentials = req.body;

    if (!credentials.email || !credentials.password) {
      return res
        .status(500)
        .json({ error: 'Eroare server... Încercați din nou.' });
    }

    let user = await Pacients.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      user = await Employees.findOne({
        where: {
          email: credentials.email,
        },
      });
    }
    
    if (user) {
      if (await bcrypt.compare(credentials.password, user.password)) {
        delete user.dataValues.password;
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;

        res.status(200).json(user);
      } else {
        res.status(401).json({ error: 'unauthorized' });
      }
    } else {
      res.status(401).json({ error: 'unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Eroare server... Încercați din nou.' });
  }
});

module.exports = router;
