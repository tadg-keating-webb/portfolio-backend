const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validators/userValidator');

router.post('/', validateUser, authController.login);

module.exports = router;
