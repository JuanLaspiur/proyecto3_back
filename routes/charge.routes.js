const express = require('express')
const router = express.Router()
const chargesController = require('../controllers/charges.controller')
const { companyAuth } = require('../middleware/auth')

router.post('/createCharge', companyAuth, chargesController.createCharge);

router.patch('/deactivateCharge/:id', companyAuth, chargesController.deactivateCharge);

router.patch('/notify/:id', companyAuth, chargesController.notify);

router.get('/getAll', companyAuth, chargesController.getAll);

router.get('/getByMonths/:mes/:anio', companyAuth, chargesController.getByMonths);

router.put('/:id', companyAuth, chargesController.editCharge);

module.exports = router