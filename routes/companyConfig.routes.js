const express = require('express')
const router = express.Router()
const companyConfigController = require('../controllers/companyConfig.controller')
const { companyAuth } = require('../middleware/auth')
/**
 * @openapi
 * /api/companyConfig/createArea:
 *   post:
 *     summary: crear un area nueva
 *     tags:
 *       - CreateArea
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
 *                     example: Ventas
 *                   description:
 *                     type: string
 *                     example: texto de ejemplo
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
 *                 newArea:
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
router.post('/createArea', companyAuth, companyConfigController.createArea)

/**
 * @openapi
 * /api/companyConfig/createDepartament:
 *   post:
 *     summary: crear un departamento nuevo
 *     tags:
 *       - CreateDepartament
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   area:
 *                     type: objectId
 *                     example: ''
 *                   name:
 *                     type: string
 *                     example: Ventas
 *                   description:
 *                     type: string
 *                     example: texto de ejemplo
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
 *                 newDepartament:
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
router.post('/createDepartament', companyAuth, companyConfigController.createDepartament)

/**
 * @openapi
 * /api/companyConfig/createPosition:
 *   post:
 *     summary: crear un cargo nuevo
 *     tags:
 *       - CreatePosition
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   area:
 *                     type: objectId
 *                     example: ''
 *                   departament:
 *                     type: objectId
 *                     example: ''
 *                   name:
 *                     type: string
 *                     example: Ventas
 *                   description:
 *                     type: string
 *                     example: texto de ejemplo
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
 *                 newArea:
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
router.post('/createPosition', companyAuth, companyConfigController.createPosition)

router.patch('/editArea/:id', companyAuth, companyConfigController.editArea)
router.patch('/editDepartament/:id', companyAuth, companyConfigController.editDepartament)
router.patch('/editPosition/:id', companyAuth, companyConfigController.editPosition)

router.patch('/deactivateArea/:id', companyAuth, companyConfigController.deactivateArea)
router.patch('/deactivateDepartament/:id', companyAuth, companyConfigController.deactivateDepartament)
router.patch('/deactivatePosition/:id', companyAuth, companyConfigController.deactivatePosition)

router.get('/getAllAreas', companyAuth, companyConfigController.getAllAreas)
router.get('/getAllDepartaments', companyAuth, companyConfigController.getAllDepartaments)
router.get('/getAllPositions', companyAuth, companyConfigController.getAllPositions)

router.post('/getAreasFilter', companyAuth, companyConfigController.getAreasFilter)
router.post('/getDepartamentsFilter', companyAuth, companyConfigController.getDepartamentsFilter)
router.post('/getPostionsFilter', companyAuth, companyConfigController.getPostionsFilter)

router.get('/findAreaById/:id', companyAuth, companyConfigController.findAreaById)
router.get('/findDepartamentById/:id', companyAuth, companyConfigController.findDepartamentById)
router.get('/findPositionById/:id', companyAuth, companyConfigController.findPositionById)

router.get('/findPositionByDepartament/:id', companyAuth, companyConfigController.findPositionByDepartament)
router.get('/findDepartamentsByArea/:id', companyAuth, companyConfigController.findDepartamentsByArea)

module.exports = router