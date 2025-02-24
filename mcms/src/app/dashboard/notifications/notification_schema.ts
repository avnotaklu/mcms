import { customerSchema } from "@/customer_schema";
import { z } from "zod";

const DeleteCustomerSchema = z.object({
  id: z.string().uuid(), // Assuming customerId is a UUID
  status: z.enum(["Pending", "Paid", "Overdue"]),
});

const notificationSchema = z.object({
  id: z.string(),
  message: z.string().min(1, "Message is required"),
  customerUpdate: customerSchema.nullable(),
  deleteCustomer: DeleteCustomerSchema.nullable(),
  customerData: customerSchema.nullable(),
});

type NotificationType = z.infer<typeof notificationSchema>;

export { notificationSchema, type NotificationType };
