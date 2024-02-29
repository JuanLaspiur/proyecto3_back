const express = require('express')
const router = express.Router()
const proposalController = require('../controllers/proposal.controller')
const { companyAuth } = require('../middleware/auth')
/**
 * @openapi
 * /api/proposal/createProposal:
 *   post:
 *     summary: crear una propuesta nueva
 *     tags:
 *       - CreateProposal
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
 *                 newProposal:
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
router.post('/createProposal', companyAuth, proposalController.createProposal)

router.patch('/editProposal/:id', companyAuth, proposalController.editProposal)

router.patch('/deactivateProposal/:id', companyAuth, proposalController.deactivateProposal)

router.get('/getAll', companyAuth, proposalController.getAll)

router.get('/getAllByPages/:page', companyAuth, proposalController.getAllByPages)

router.get('/findById/:id', companyAuth, proposalController.findById)


module.exports = router