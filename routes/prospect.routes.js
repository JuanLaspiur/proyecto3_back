const express = require("express");
const router = express.Router();
const prospectController = require("../controllers/prospect.controller");
const { companyAuth } = require("../middleware/auth");
/**
 * @openapi
 * /api/prospect/createProspect:
 *   post:
 *     summary: crear un Prospect nuevo
 *     tags:
 *       - CreateProspect
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Roberto Carlos
 *                   identificationNumber:
 *                     type: string
 *                     example: 41555555
 *                   country:
 *                     type: string
 *                     example: Argentina
 *                   city:
 *                     type: string
 *                     example: San Miguel
 *                   address:
 *                     type: string
 *                     example: Corriente 1050
 *                   email:
 *                     type: string
 *                     example: roberto@gmail.com
 *                   phoneNumber:
 *                     type: string
 *                     example: 384545644
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
 *                 newProspect:
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
router.post("/createProspect", companyAuth, prospectController.createProspect);

router.patch("/editProspect/:id", companyAuth, prospectController.editProspect);

router.patch(
  "/deactivateProspect/:id",
  companyAuth,
  prospectController.deactivateProspect
);

router.get("/getAll", companyAuth, prospectController.getAll);

router.get(
  "/getAllByPages/:page",
  companyAuth,
  prospectController.getAllByPages
);

router.get("/findById/:id", companyAuth, prospectController.findById);
router.get("/clients", companyAuth, prospectController.getAllClients);

module.exports = router;
