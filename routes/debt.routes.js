const express = require("express");
const router = express.Router();
const debtsController = require("../controllers/debts.controller");
const { companyAuth } = require("../middleware/auth");

router.post("/createDebt", companyAuth, debtsController.createDebt);

router.patch('/deactivateDebt/:id', companyAuth, debtsController.deactivateDebt)

router.get('/getAll', companyAuth, debtsController.getAll)

router.get('/getAllByPages/:page', companyAuth, debtsController.getAllByPages)

router.get('/totalDebts', companyAuth, debtsController.totalDebts)

module.exports = router;