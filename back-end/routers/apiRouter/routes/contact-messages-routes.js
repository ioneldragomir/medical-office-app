const express = require('express');
const router = express.Router();

const { ContactMessages } = require('../../../tables');

router
  .route('/')
  .get(async (req, res) => {
    try {
      const contactMessages = await ContactMessages.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      return res.status(200).json(contactMessages);
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
        return res.status(500).json({
          error: 'Eroare server... Încercați din nou.',
        });
      }

      req.body.date = new Date().toLocaleString('ro-Ro');
      req.body.viewed = 'false';

      await ContactMessages.create(req.body);
      return res.status(200).json({ success: 'Mesajul a fost trimis.' });
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .put(async (req, res) => {
    try {
      console.log(req.body);
      ContactMessages.destroy({ where: { id: req.body.ids }})
      return res.status(200).json({ success: 'Mesajele au fost șterse.' });
     
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

router
  .route('/:contactId')
  .get(async (req, res) => {
    try {
      const contactMessage = await ContactMessages.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { id: req.params.contactId },
      });

      if (contactMessage) {
        return res.status(200).json(contactMessage);
      } else {
        return res.status(404).json({ error: 'Mesajul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .put(async (req, res) => {
    try {
      const contactMessage = await ContactMessages.findByPk(
        req.params.contactId
      );
      if (contactMessage) {

        const newContactMessage = await contactMessage.update(req.body);

        delete newContactMessage.dataValues.createdAt;
        delete newContactMessage.dataValues.updatedAt;

        return res.status(200).json(newContactMessage);
      } else {
        return res.status(404).json({ error: 'Mesajul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const contactMessage = await ContactMessages.findByPk(
        req.params.contactId
      );
      if (contactMessage) {
        await contactMessage.destroy();
        return res.status(200).json({ success: 'Mesajul a fost șters.' });
      } else {
        return res.status(404).json({ error: 'Mesajul căutat nu există.' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Eroare server... Încercați din nou.',
      });
    }
  });

module.exports = router;
