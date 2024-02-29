const path = require('path')
const express = require('express')
const router = express.Router()
const upload = require(path.join(__dirname, '..', 'middleware', 'upload.middleware'))

const WorkingDayController = require(path.join(__dirname, '..', 'controllers', 'working_day.controller'))

router.get('/', WorkingDayController.getWorkingDays)
router.get('/by-employee/:id', WorkingDayController.getByEmployeerId)
router.get('/getADayOfEmployee/:idUser/:day/:month/:year', WorkingDayController.getADayOfEmployee)
router.get('/salary/:id/:year/:month', WorkingDayController.getSalaryOfEmployee)
router.get('/salary/all/:idCompany/:year/:month', WorkingDayController.getSalaryOfAllEmployees)

router.post('/mark', upload.single('files'), WorkingDayController.createMark)

module.exports = router