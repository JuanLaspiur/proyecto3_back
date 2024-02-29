const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const upload = require('../middleware/upload.middleware')
const { companyAuth } = require('../middleware/auth')

router.get('/hello', userController.test)
/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Registro de usuarios
 *     tags:
 *       - Register
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: 'fran@quercu.com'
 *                   password:
 *                     type: string
 *                     example: '123456789A'
 *                   name:
 *                     type: string
 *                     example: 'Francisco Mansilla'
 *                   role:
 *                     type: array
 *                     example: [10]
 *     responses:
 *       200:
 *         description: Usuario Registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Usuario Registrado!
 *                 newUser:
 *                   type: object
 *                   example: {}
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoicm
 *       400:
 *         description: El usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: El usuario ya existe!
 *       409:
 *         description: Error al registrar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Error al registrar
 *       404:
 *         description: Error al registrar usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Error al registrar usuario!
 *                 
 */
router.post('/register', upload.single('profileImage'), userController.register)

router.post('/test', upload.single('profileImage'), userController.test)

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Logeo de usuarios
 *     tags:
 *       - Login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'fran@quercu.com'
 *               password:
 *                 type: string
 *                 example: '123456789A'
 *     responses:
 *       200:
 *         description: Logeo exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: logueado
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoicm
 *       400:
 *         description: Contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Contraseña incorrecta!
 *       404:
 *         description: Usuario no registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Usuario no registrado!
 *                 
*/
router.post('/login', userController.login)

/**
 * @openapi
 * /api/user/info:
 *   get:
 *     summary: informacion de usuario
 *     tags:
 *       - Info
 *     responses:
 *       200:
 *         description: proceso exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: no auth
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 auth:
 *                   type: string
 *                   example: no auth!
 *       404:
 *         description: no auth, no user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 auth:
 *                   type: string
 *                   example: no auth, no user!
 *                 
*/
router.get('/info', userController.info)

router.get('/getById/:id', userController.getById)

//Cambiar contraseñas
router.put('/password_recovery/:id', userController.changePassword);

// * Empleados
router.post('/employee/invite', userController.inviteEmployee);
router.post('/employee/register', userController.registerEmployee);
router.patch('/employee/editEmployee/:id', companyAuth, userController.editEmployee)
router.patch('/employee/deactivateEmployee/:id', companyAuth, userController.deactivateEmployee)
router.get('/employee/getAll', companyAuth, userController.getAllEmployees)
router.get('/employee/getAllEmployeesByPages/:page', companyAuth, userController.getAllEmployeesByPages)

// * Enlazar

router.post('/:id/linkDiscordAccount', userController.linkDiscord)

module.exports = router