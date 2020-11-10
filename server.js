const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const { connecToDatabase } = require('./config/db');
const apiRoutes = require('./routes/api/index');

// Connect to database
connecToDatabase();

app.use(express.json({ extended: false }));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
