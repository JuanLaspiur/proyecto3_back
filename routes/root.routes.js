const express = require('express')
const router = express.Router()
const rootController = require('../controllers/root.controller')
const { rootAuth } = require('../middleware/auth')

/**
 * @openapi
 * /api/root/getAllCompanies:
 *   get:
 *     summary: Obtener lista de todos los usuarios empresas
 *     tags:
 *       - GetAllCompanies
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
 *                 companies:
 *                   type: array
 *                   example: []
 *                 token:
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
router.get('/getAllCompanies', rootAuth, rootController.getAllCompanies)

module.exports = router