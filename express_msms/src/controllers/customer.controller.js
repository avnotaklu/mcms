const { validationResult } = require("express-validator");

function customerController(customerService) {
  const getAllCustomers = async (req, res) => {
    try {
      const response = await customerService.getAllCustomers();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  const getCustomerById = async (req, res) => {
    try {
      const response = await customerService.getCustomerById(req.params.id);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  const deleteCustomer = async (req, res) => {
    try {
      const response = await customerService.deleteCustomer(req.params.id);
      res.json({ result: response.result == "deleted" ? true : false });
    } catch (error) {
      console.error(error);
      res.json({ result: false });
    }
  };

  const createCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = req.body;
      const response = await customerService.createCustomer(data);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  const updateCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await customerService.updateCustomer(req.body);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  const bulkUploadCustomers = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ errors: [{ msg: "No file uploaded" }] });
    }

    const response = await customerService.bulkUpload(req.file.buffer);

    const message = response.message;
    const validCustomers = response.result.new;
    const errors = response.result.errors;
    const addedCustomers = [];

    for (const customer of validCustomers) {
      const customerData = await customerService.createCustomer(customer);
      addedCustomers.push(customerData);
    }

    res.json({
      message,
      result: { new: addedCustomers, errors },
    });
  };

  /**
   * This is mock API for creating a payment order that the client calls to initiate payment
   */
  const customerPaymentOrder = async (req, res) => {
    try {
      // Customer id would usually be sent via a token, but for simplicity, we are sending it via the request body
      const { customerId } = req.body;

      // Order Id/amount would be usually used to track the payment, however it is not used in this mock API
      let orderId = "ORD" + Math.floor(Math.random() * 1000000);
      var customer = await customerService.getCustomerById(customerId);
      let amount = customer.outstandingAmount;

      if (amount == 0 || customer.status == "Paid") {
        return res.status(400).json({ errors: [{ msg: "Invalid Operation" }] });
      }

      // we are also not handling overdue payment in any special way.

      res.json({
        orderId,
        customerId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  /**
   * This is mock API callback that a payment gateway typically calls to confirm payment
   */
  const customerPaymentHandler = async (req, res) => {
    try {
      const { orderId, customerId } = req.body;

      let response = await customerService.updateCustomer({
        id: customerId,
        status: "Paid", // I am just setting the payment as successful
      });

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  return {
    getAllCustomers,
    getCustomerById,
    deleteCustomer,
    createCustomer,
    updateCustomer,
    bulkUploadCustomers,
    customerPaymentOrder,
    customerPaymentHandler,
  };
}

module.exports = {
  customerController,
};
