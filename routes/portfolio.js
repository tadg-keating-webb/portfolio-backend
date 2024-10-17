const authenticated = require('../middleware/authenticated');
var express = require('express');
var router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/', portfolioController.index);

router.get('/:id', portfolioController.show);

router.post('/', authenticated, portfolioController.create);

router.patch('/:id', authenticated, portfolioController.update);

router.delete('/:id', authenticated, portfolioController.delete);

module.exports = router;
