const authenticated = require('../middleware/authenticated');
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const validatePortfolio = require('../middleware/validators/portfolioValidator');

router.get('/', portfolioController.index);

router.get('/:id', portfolioController.show);

router.post('/', [authenticated, validatePortfolio], portfolioController.create);

router.patch('/:id', authenticated, portfolioController.update);

router.delete('/:id', authenticated, portfolioController.delete);

module.exports = router;
