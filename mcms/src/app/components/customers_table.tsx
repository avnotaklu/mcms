import { CustomerData } from "@/customer_schema";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomersTable({
  customers,
  statusFilter,
  searchQuery,
}: CustomersTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "outstandingAmount";
    order: "asc" | "desc";
  }>({
    key: "name",
    order: "asc",
  });

  const sortedCustomers = [...customers].sort((a, b) => {
    const { key, order } = sortConfig;
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(
    (customer) =>
      (!statusFilter || customer.status === statusFilter) &&
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (key: "name" | "outstandingAmount") => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  function handleEdit(customer: CustomerData): void {
    router.push(`/dashboard/update_customer?id=${customer.id}`);
  }

  async function handleDelete(customer: CustomerData) {
    const response = await fetch(
      `http://localhost:8080/api/customer/delete/${customer.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      alert("Failed to delete customer");
    }

    alert("Successfully deleted customer");
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200 max-h-xl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortConfig.key === "name" ? (
                sortConfig.order === "asc" ? (
                  <ArrowUp size={14} className="inline" />
                ) : (
                  <ArrowDown size={14} className="inline" />
                )
              ) : (
                ""
              )}
            </th>
            <th className="p-3">Contact Information</th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => handleSort("outstandingAmount")}
            >
              Outstanding Payment Amount{" "}
              {sortConfig.key === "outstandingAmount" ? (
                sortConfig.order === "asc" ? (
                  <ArrowUp size={14} className="inline" />
                ) : (
                  <ArrowDown size={14} className="inline" />
                )
              ) : (
                ""
              )}
            </th>
            <th className="p-3">Payment Due Date</th>
            <th className="p-3">Payment Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.contact}</td>
                <td className="p-3">
                  ${customer.outstandingAmount.toFixed(2)}
                </td>
                <td className="p-3">{customer.dueDate}</td>

                <td
                  className={`p-3 font-semibold ${
                    customer.status === "Paid"
                      ? "text-green-600"
                      : customer.status === "Overdue"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {customer.status}
                </td>

                <td className="p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(customer)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-3 text-center text-gray-500">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface CustomersTableProps {
  customers: CustomerData[];
  statusFilter: string;
  searchQuery: string;
}
