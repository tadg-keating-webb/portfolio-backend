const { check, validationResult } = require('express-validator');

const validatePortfolio = (req, res, next) => {
    check('title')
        .isString()
        .escape();

    check('description')
        .isString();

    check('demoUrl')
        .optional()
        .escape();

    check('githubUrl')
        .optional()
        .escape();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

module.exports = validatePortfolio;
