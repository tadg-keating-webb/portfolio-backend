const { check, validationResult } = require('express-validator');

const titleLength = 5;
const descriptionLength = 20;

const validatePortfolio = [
    check('title')
        .isLength({ min: titleLength })
        .withMessage('Title must be at least chars long')
        .escape(),
    check('description')
        .isLength({ min: descriptionLength })
        .withMessage('Description must be at least 20 chars long')
        .escape(),
    check('demoUrl')
        .optional()
        .isURL()
        .withMessage('Demo URL must be a valid URL'),
    check('githubUrl')
        .optional()
        .isURL()
        .withMessage('GitHub URL must be a valid URL'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        next();
    }
];
module.exports = validatePortfolio;
