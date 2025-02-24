import { z } from "zod";

const customerCreationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact information is required"),
  outstandingAmount: z.number().min(0, "Amount must be 0 or greater"),
  dueDate: z.string().refine(
    (dateStr) => {
      const selectedDate = new Date(dateStr);
      return selectedDate >= new Date();
    },
    { message: "Date must be after today" }
  ),
  status: z.enum(["Pending", "Paid", "Overdue"]),
});

type CustomerCreationData = z.infer<typeof customerCreationSchema>;

const customerSchema = customerCreationSchema.extend({
  id: z.string().uuid(),
});

type CustomerData = z.infer<typeof customerSchema>;

export {
  customerCreationSchema,
  customerSchema,
  type CustomerCreationData,
  type CustomerData,
};
