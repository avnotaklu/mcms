const { json } = require("express");
const validateCustomerParams = require("../dto/customer_dto");
const xlsx = require("xlsx");
const logger = require("../config/logger");
const { client } = require("../config/db");
const { getWSS } = require("../config/websocket");
const WebSocket = require("ws");
const { sendNotification } = require("./notification.service");

function customerService() {
  const getAllCustomers = async () => {
    const response = await client.search({
      index: "customers",
      body: {
        query: {
          match_all: {},
        },
        size: 1000,
      },
    });

    return response.hits.hits.map((e) => {
      return { id: e._id, ...e._source };
    });
  };

  const getCustomerById = async (id) => {
    const response = await client.get({
      index: "customers",
      id: id,
    });

    return { ...response._source, id };
  };

  const createCustomer = async (data) => {
    const { name, contact, outstandingAmount, dueDate, status } = data;

    const body = {
      name: name,
      contact: contact,
      outstandingAmount: status == "Paid" ? 0 : outstandingAmount,
      dueDate: dueDate,
      status: status,
    };

    const response = await client.index({
      index: "customers",
      body: body,
    });

    console.log(response);

    const id = response._id;

    const customer = { ...body, id };

    sendNotification(
      `New Customer Added: Customer ${id} has been added to the database`,
      {
        customerData: customer,
      }
    );
    return customer;
  };

  const deleteCustomer = async (id) => {
    const response = await client.delete({
      index: "customers",
      id: id,
    });

    sendNotification(
      `Customer Deleted: Customer ${id} has been removed from the database`,
      {
        deleteCustomer: {
          id,
        },
      }
    );

    return response;
  };

  const updateCustomer = async (data) => {
    const { id, name, contact, outstandingAmount, dueDate, status } = data;

    const oldCustomer = await getCustomerById(id);

    const customerUpdatePart = {
      outstandingAmount: status == "Paid" ? 0 : outstandingAmount,
      status,
      contact: contact ?? oldCustomer.contact,
      name: name ?? oldCustomer.name,
      dueDate: dueDate ?? oldCustomer.dueDate,
    };

    const response = await client.update({
      index: "customers",
      id: id,
      body: {
        doc: customerUpdatePart,
      },
    });

    const customerUpdate = customerUpdatePart & { id };

    if (status == "Paid") {
      sendNotification(`Payment Recieved: Customer ${id} has paid their dues`, {
        customerUpdate,
      });
    }

    if (status == "Overdue") {
      sendNotification(
        `Payment Overdue: Customer ${id} hasn't paid their dues in time`,
        {
          customerUpdate,
        }
      );
    }

    if (status == "Pending") {
      sendNotification(`Payment Overdue: Customer ${id} has pending dues`, {
        customerUpdate,
      });
    }

    return response;
  };

  const bulkUpload = async (buffer) => {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    const extractedData = data.map((row) => ({
      name: row["Name"],
      contact: row["Contact Information"],
      outstandingAmount: row["Outstanding Payment Amount"],
      dueDate: row["Payment Due Date"],
      status: row["Payment Status"],
    }));

    const [errors, validCustomers] = await _validateAndAddCustomers(
      extractedData
    );

    const result = {
      new: validCustomers,
      errors,
    };

    let summary = "";

    summary +=
      validCustomers.length != 0
        ? `${validCustomers.length} Added successfully`
        : "No records added, could be a schema issue";

    if (validCustomers.length > 0) {
      summary +=
        errors.length != 0
          ? `, row(s) numbered [${errors}] contains some errors`
          : `, no rows contain any errors`;
    }

    logger.info(summary);

    return {
      message: summary,
      result,
    };
  };

  const _validateOneCustomer = async (customer) => {
    const errors = [];
    for (const rule of validateCustomerParams) {
      const error = await rule.run({ body: customer });
      if (!error.isEmpty()) {
        errors.push(error);
      }
    }
    return errors;
  };

  const _validateAndAddCustomers = async (customers) => {
    const errors = [];

    const validCustomers = [];

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const result = await _validateOneCustomer(customers[i]);
      if (result.length != 0) {
        errors.push(i);
      } else {
        validCustomers.push(customer);
      }
    }

    return [errors, validCustomers];
  };

  return {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    bulkUpload,
  };
}

module.exports = {
  customerService,
};
