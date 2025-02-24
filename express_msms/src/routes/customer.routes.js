const express = require("express");
const { verifyToken } = require("../middlewares/auth_middleware");
const { upload } = require("../config/multer");
const validateCustomerParams = require("../dto/customer_dto");

function customerRouter(customerController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Customers
   *   description: API endpoints for managing customers
   */

  /**
   * @swagger
   * /api/customer/get-all:
   *   get:
   *     summary: Retrieve all customers
   *     tags: [Customers]
   *     description: Fetches a list of all customers (Requires authentication).
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved list of customers.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Customer'
   *       401:
   *         description: Unauthorized (Invalid token).
   */
  router.get("/get-all", verifyToken, customerController.getAllCustomers);

  /**
   * @swagger
   * /api/customer/{id}:
   *   get:
   *     summary: Get customer by ID
   *     tags: [Customers]
   *     description: Fetches details of a specific customer by ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The customer's unique ID.
   *     responses:
   *       200:
   *         description: Customer found.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Customer'
   *       404:
   *         description: Customer not found.
   */
  router.get("/:id", customerController.getCustomerById);

  /**
   * @swagger
   * /api/customer/delete/{id}:
   *   delete:
   *     summary: Delete customer by ID
   *     tags: [Customers]
   *     description: Delete a specific customer by ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The customer's unique ID.
   *     responses:
   *       200:
   *         description: Customer delete.
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 result:
   *                   type: boolean
   *       404:
   *         description: Customer not found.
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 result:
   *                   type: boolean
   *                   example: false
   */
  router.delete("/delete/:id", customerController.deleteCustomer);

  /**
   * @swagger
   * /api/customer/create:
   *   post:
   *     summary: Create a new customer
   *     tags: [Customers]
   *     description: Adds a new customer (Requires authentication).
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CustomerDto'
   *     responses:
   *       201:
   *         description: Customer created successfully.
   *       400:
   *         description: Validation error.
   */
  router.post(
    "/create",
    verifyToken,
    validateCustomerParams,
    customerController.createCustomer
  );

  /**
   * @swagger
   * /api/customer/update:
   *   post:
   *     summary: Update a customer
   *     tags: [Customers]
   *     description: Updates an existing customer's details (Requires authentication).
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CustomerDto'
   *     responses:
   *       200:
   *         description: Customer updated successfully.
   *       400:
   *         description: Validation error.
   *       404:
   *         description: Customer not found.
   */
  router.post(
    "/update",
    verifyToken,
    validateCustomerParams,
    customerController.updateCustomer
  );

  /**
   * @swagger
   * /api/customer/bulk-upload:
   *   post:
   *     summary: Bulk upload customers
   *     tags: [Customers]
   *     description: Upload a file to bulk create customers (Requires authentication).
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Customers uploaded successfully.
   *       400:
   *         description: Invalid file format.
   */
  router.post(
    "/bulk-upload",
    upload.single("file"),
    verifyToken,
    customerController.bulkUploadCustomers
  );

  /**
   * @swagger
   * /api/customer/initiate-payment:
   *   post:
   *     summary: Initiate a payment
   *     tags: [Customers]
   *     description: Starts a payment order for a customer.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerId
   *               - amount
   *             properties:
   *               customerId:
   *                 type: string
   *                 example: "XXXXX"
   *     responses:
   *       200:
   *         description: Payment initiated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               required:
   *                 - orderId
   *                 - customerId
   *               properties:
   *                 orderId:
   *                   type: string
   *                   example: "ORD12345"
   *                 customerId:
   *                   type: string
   *                   example: "XXXXX"
   *       400:
   *         description: Invalid request.
   */
  router.post("/initiate-payment", customerController.customerPaymentOrder);

  /**
   * @swagger
   * /api/customer/response-handler:
   *   post:
   *     summary: Handle payment response
   *     tags: [Customers]
   *     description: Processes the response from a payment gateway.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *               - customerId
   *             properties:
   *               orderId:
   *                 type: string
   *                 example: "txn_abc123"
   *               customerId:
   *                 type: string
   *                 example: "XXXXX"
   *     responses:
   *       200:
   *         description: Payment response processed successfully.
   *       400:
   *         description: Invalid response data.
   */
  router.post("/response-handler", customerController.customerPaymentHandler);

  return router;
}

module.exports = { customerRouter };
