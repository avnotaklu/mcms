const { body } = require("express-validator");

// Validation rules
const validateAuthParams = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = {
  validateAuthParams,
};
