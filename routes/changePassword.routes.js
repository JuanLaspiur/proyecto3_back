const express = require("express");
const path = require("path");
const router = express.Router();
const changePasswordController = require(path.join(__dirname, '..', 'controllers', 'changePasswordRequests.controller'));

router.post('/', changePasswordController.createCode);
router.post('/verifyCode', changePasswordController.verifyCode);
router.put('/', changePasswordController.changePassword);

module.exports = router;