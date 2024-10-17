const authenticated = require('../middleware/authenticated');
var express = require('express');
var router = express.Router();
const Portfolio = require('../models/portfolio');

/* INDEX */
router.get('/', async (req, res) => {
    try {
        const data = await Portfolio.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* CREATE */
router.post('/', authenticated, async (req, res) => {
    const portfolioItem = req.body;

    const portfolio = new Portfolio(portfolioItem);

    try {
        const dataToSave = await portfolio.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

/* SHOW */
router.get('/:id', async (req, res) => {
    try {
        const data = await Portfolio.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

/* UPDATE */
router.patch('/:id', authenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Portfolio.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

/* DELETE */
router.delete('/:id', authenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Portfolio.findByIdAndDelete(id)
        res.send(`Item: ${data.title} has been deleted.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

module.exports = router;
