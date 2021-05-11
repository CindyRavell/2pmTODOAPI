// Modules
const express = require('express');
const app = express();
const PORT = 5000;

// Router
const routes = require('./routes/router');

// Middleware to parse body
app.use(express.json());

// Define routes
app.use(routes);
app.use((req, res) => {
  res.status(404).json({
    message: 'Ups!!! Resource not found.',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});