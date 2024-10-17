const Portfolio = require("../models/portfolio");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    try {
        const data = await Portfolio.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.create = asyncHandler(async (req, res, next) => {
    const portfolio = new Portfolio(req.body);

    try {
        const dataToSave = await portfolio.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

exports.show = asyncHandler(async (req, res, next) => {
    try {
        const data = await Portfolio.findById(req.params.id);

        return data ? res.json(data) : res.status(404).json({ message: 'Item not found' });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.update = asyncHandler(async (req, res, next) => {
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

exports.delete = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Portfolio.findByIdAndDelete(id)
        res.send(`Item: ${data.title} has been deleted.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});
