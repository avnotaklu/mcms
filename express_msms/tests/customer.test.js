const request = require("supertest");
const { customerService } = require("../src/services/customer.service");

const fs = require("fs");
const path = require("path");

/**
 * This is a unit test to test bulk upload
 */
describe("Bulk upload", () => {
  test("Bulk upload summary, Good Schema", async () => {
    const file = fs.readFileSync(
      path.join(__dirname, "../../sample_payments.xlsx")
    );

    const result = await customerService().bulkUpload(file);

    expect(result.message).toBe(
      "3 Added successfully, row(s) numbered [3] contains some errors"
    );
  });

  test("Bulk upload summary, Bad Schema", async () => {
    const file = fs.readFileSync(
      path.join(__dirname, "../../sample_payments_fail.xlsx")
    );

    const result = await customerService().bulkUpload(file);

    expect(result.message).toBe("No records added, could be a schema issue");
  });

  // TODO: Handle more edge cases
});
