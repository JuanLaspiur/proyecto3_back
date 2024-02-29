const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");
const { companyAuth } = require("../middleware/auth");

router.post("/createContract", companyAuth, contractController.createContract);

router.patch('/deactivateContract/:id', companyAuth, contractController.deactivateContract)

router.get('/getAll', companyAuth, contractController.getAll)

router.get('/getAllByPages/:page', companyAuth, contractController.getAllByPages)

router.get('/:id', companyAuth, contractController.getById)

router.put('/:id', companyAuth, contractController.editContract)

module.exports = router;
