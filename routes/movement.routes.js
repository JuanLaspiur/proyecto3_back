const express = require('express')
const router = express.Router()
const movementsController = require('../controllers/movements.controller')
const { companyAuth } = require('../middleware/auth')

router.post('/createMovement', companyAuth, movementsController.createMovement)

router.patch('/deactivateMovement/:id', companyAuth, movementsController.deactivateMovement)

router.get('/getAll', companyAuth, movementsController.getAll)

router.get('/getAllByPages/:page', companyAuth, movementsController.getAllByPages)

router.get('/getByMonths/:mes/:anio', companyAuth, movementsController.getByMonths)

router.get('/getBalanceByYear/:anio', companyAuth, movementsController.getBalanceByYear)

module.exports = router