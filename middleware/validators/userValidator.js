const { check, validationResult } = require('express-validator');

const validateUser = [
    check('password')
        .notEmpty()
        .withMessage('Password is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
];

module.exports = validateUser;
