const express = require('express')
const router = express.Router()
const taskController = require('../controllers/task.controller')
const { companyAuth } = require('../middleware/auth')

router.post('/create', companyAuth, taskController.create)

router.patch('/disable/:id', companyAuth, taskController.disable)
router.patch('/finish/:id', companyAuth, taskController.finish)
router.patch('/review/:id', companyAuth, taskController.review)
router.patch('/update/:id', companyAuth, taskController.update)


router.get('/getAllWithoutEmployee', companyAuth, taskController.getAllWithoutEmployee);
router.get('/getByEmployee/:userId', taskController.getByEmployee)
router.get('/finished', companyAuth, taskController.getAllFinished)
router.get('/:id', companyAuth, taskController.get)
router.get('/', companyAuth, taskController.getAll)

// * HITOS

router.get('/milestones/:taskId', companyAuth, taskController.getMilestonesOfTask)

router.post('/milestones/create', companyAuth, taskController.createMilestone)

router.put('/milestones/update/:milestoneId', companyAuth, taskController.updateMilestone)
router.delete('/milestones/delete/:milestoneId', companyAuth, taskController.deleteMilestone)

module.exports = router