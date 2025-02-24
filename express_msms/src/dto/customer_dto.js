const { body } = require("express-validator");
// type CustomerData = {
//   id: number,
//   name: string,
//   contact: string,
//   outstandingAmount: number,
//   dueDate: string,
//   status: "Paid" | "Pending" | "Overdue",
// };

const validateCustomerParams = [
  body("name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name must be a non empty string"),
  body("contact")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Contact must be a non empty string"),
  body("outstandingAmount")
    .isFloat({ min: 0 })
    .withMessage("Outstanding amount must be a number greater than 0"),
  body("dueDate")
    .isISO8601()
    .isDate()
    .isAfter(new Date().toISOString().split("T")[0])
    .withMessage("Due date must be a date after current date"),
  body("status")
    .isIn(["Paid", "Pending", "Overdue"])
    .withMessage((v, m) => `Invalid status provided "${v}"`)
    .custom((value, { req }) => {
      if (value !== "Paid" && req.body.outstandingAmount === 0) {
        throw new Error(
          "Outstanding amount must not be 0 for Unpaid customers"
        );
      }
      return true;
    }),
];

module.exports = validateCustomerParams;
