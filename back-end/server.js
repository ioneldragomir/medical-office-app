const express = require('express');
const cors = require('cors');

const sequelize = require('./sequelize')

const PORT = 8080;

const app = express();

app.use(express.json({ limit: '10MB' }));
app.use(cors());

app.use('/sync', require('./routers/database-sync'));
app.use('/login', require('./routers/login'));
app.use('/password', require('./routers/password-routes'));
app.use('/api', require('./routers/apiRouter/api-router'));

app.listen(PORT, async () => {
  console.warn(`Server started on http://localhost:${PORT}.`);

  try {
    await sequelize.authenticate();

    console.warn('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database.\n', error);
  }
})