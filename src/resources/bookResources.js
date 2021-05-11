//RESOURCES PARA EL DOMINIO USER. AQUÍ VAN LOS ENDPOINTS y se enlaza al controlador

// Modules
const { request } = require('express');
const express = require('express');
const { check} = require('express-validator');
const BookResources = express.Router();

// Controllers
const { BookControllers } = require('../controllers');


// All user resources

BookResources.get('/parameters', BookControllers.getByParameters);
BookResources.get('/', BookControllers.getAll);

BookResources.post('/', check('publicationYear','must be number or out of range').isInt({min:1454, max:2021}),
                        check('title','Invalid Data,  an string is needed').isString(),
                        check('author','Invalid Data,  an string is needed').isString(),
                        check('tags','Invalid Data, an array is needed').isArray() ,BookControllers.createBook);

BookResources.get('/guid/:guid', BookControllers.getByGuid);
BookResources.put('/:guid', check('publicationYear','must be number or out of range').optional().isInt({min:1454, max:2021}),
                            check('title','Invalid Data,  an string is needed').optional().isString(),
                            check('author','Invalid Data,  an string is needed').optional().isString(),
                            check('tags','Invalid Data, an array is needed').optional().isArray() ,BookControllers.updateBook);

BookResources.delete('/:guid', BookControllers.deleteBook);

module.exports = BookResources;
