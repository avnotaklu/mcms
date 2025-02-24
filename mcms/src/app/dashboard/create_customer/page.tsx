"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { customerCreationSchema } from "@/customer_schema";

export default function CreateCustomer() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(customerCreationSchema),
  });

  console.log("IsSubmitting", isSubmitting);

  async function onSubmit(data: any) {
    try {
      if (data.outstandingAmount !== 0 && data.status === "Paid") {
        throw new Error("Outstanding amount must be 0 for Paid customers");
      }

      if (data.outstandingAmount === 0 && data.status !== "Paid") {
        throw new Error(
          "Outstanding amount must not be 0 for Unpaid customers"
        );
      }

      const response = await fetch(
        "http://localhost:8080/api/customer/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      console.log(response);

      const error = (await response.json())?.errors?.at(0)?.msg;

      if (error) {
        throw new Error(`A failure occured: ${error}`);
      }

      if (!response.ok) throw new Error("Failed to create customer");

      router.back();

      alert("Customer created successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      <header className="text-gray-900 text-2xl font-bold">
        Create Customer
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center w-80"
      >
        <div className="w-full">
          <input
            {...register("name")}
            placeholder="Enter Name..."
            className={`w-full px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="w-full">
          <input
            {...register("contact")}
            placeholder="Enter Contact Info..."
            className={`w-full px-4 py-2 border ${
              errors.contact ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contact.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="number"
            {...register("outstandingAmount", { valueAsNumber: true })}
            placeholder="Enter Payment Amount..."
            className={`w-full px-4 py-2 border ${
              errors.outstandingAmount ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.outstandingAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.outstandingAmount.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="date"
            {...register("dueDate")}
            className={`w-full px-4 py-2 border ${
              errors.dueDate ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <button
          className="rounded-full border border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-200 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 min-w-36"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Customer"}
        </button>
      </form>
    </div>
  );
}
