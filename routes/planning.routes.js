const express = require('express')
const router = express.Router()
const planningController = require('../controllers/planning.controller')
const { companyAuth } = require('../middleware/auth')
/**
 * @openapi
 * /api/planning/createPlanning:
 *   post:
 *     summary: crear una planificacion nueva
 *     tags:
 *       - CreatePlanning
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Roberto Carlos
 *                   description:
 *                     type: string
 *                     example: texto ejemplo
 *                   steps:
 *                     type: array
 *                     example: [{}]
 *                   preDelivery:
 *                     type: array
 *                     example: [{}]
 *                   finalDelivery:
 *                     type: string
 *                     example: [{}]
 *                   moneyBadge:
 *                     type: string
 *                     example: usdt
 *     responses:
 *       200:
 *         description: respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 newPlanning:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   example: {}
 *                 
 */
router.post('/createPlanning', companyAuth, planningController.createPlanning)

router.patch('/editPlanning/:id', companyAuth, planningController.editPlanning)

router.patch('/deactivatePlanning/:id', companyAuth, planningController.deactivatePlanning)

router.get('/getAll', companyAuth, planningController.getAll)

router.get('/getAllByPages/:page', companyAuth, planningController.getAllByPages)

router.get('/findById/:id', companyAuth, planningController.findById)


module.exports = router