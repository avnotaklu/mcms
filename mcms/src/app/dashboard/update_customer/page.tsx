"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { customerCreationSchema, CustomerData } from "@/customer_schema";
import { Suspense, use, useEffect, useRef, useState } from "react";

function UpdateCustomer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const hasFetched = useRef(false);

  const [customer, setCustomer] = useState<CustomerData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(customerCreationSchema),

    defaultValues: {
      name: customer?.name ?? "",
      contact: customer?.contact ?? "",
      outstandingAmount: customer?.outstandingAmount ?? 0.0,
      dueDate: customer?.dueDate ?? "",
      status: customer?.status ?? "Pending",
    },
  });

  useEffect(() => {
    if (hasFetched.current) return; // Prevent second run
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        console.log("here");
        const response = await fetch(
          `http://localhost:8080/api/customer/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to create customer");

        const result = await response.json();
        setCustomer(result);

        // This sets the form to default values
        reset(result);
      } catch (error: any) {
        router.back();
        alert(error.message);
      }
    };

    fetchData();
  }, [router]);

  console.log("IsSubmitting", isSubmitting);

  async function onSubmit(data: any) {
    try {
      if (data.outstandingAmount === 0 && data.status !== "Paid") {
        throw new Error(
          "Outstanding amount must not be 0 for Unpaid customers"
        );
      }

      const response = await fetch(
        "http://localhost:8080/api/customer/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...data, id }),
        }
      );

      console.log(response);

      const error = (await response.json())?.errors?.at(0)?.msg;
      if (error) {
        throw new Error(`A failure occured: ${error}`);
      }

      if (!response.ok) throw new Error("Failed to update customer");

      router.back();

      alert("Customer updated successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      <header className="text-gray-900 text-2xl font-bold">
        Update Customer
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
            step="any"
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
          {isSubmitting ? "Updating..." : "Update Customer"}
        </button>
      </form>
    </div>
  );
}

export default function UpdateCustomerPage() {
  return (
    <Suspense>
      <UpdateCustomer />
    </Suspense>
  );
}
