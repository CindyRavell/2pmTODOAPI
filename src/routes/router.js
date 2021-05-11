//PROPÓSITO DE HABILITAR RUTAS y enlazarlas con los recursos

// Modules
const express = require('express');
const router = express.Router();

// Resources
const { BookResources } = require('../resources');
// All routes, va a tener habilitada la ruta users

router.use('/books', BookResources);

module.exports = router;
