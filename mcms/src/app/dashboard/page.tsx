"use client";

import { useState, useEffect, useRef, SetStateAction } from "react";
import { ArrowUp, ArrowDown, Loader } from "lucide-react";
import Link from "next/link";
import { CustomerData } from "@/customer_schema";
import NotificationBell from "../components/notification_bell";
import { useNotifications } from "../context/NotificationContext";
import { NotificationType } from "./notifications/notification_schema";
import { useRouter } from "next/navigation";
import NotificationPanel from "../components/notification_panel";
import CustomersTable from "../components/customers_table";
import TopBar from "../components/top_bar";

export default function DashboardPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsNotificationWindowOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Just using a second websocket connection for this
    // I could do it using more complex state management/handling customer state more globally, but this is simpler

    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const notification: NotificationType = JSON.parse(event.data);

      if (notification.customerUpdate) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === notification.customerUpdate?.id
              ? notification.customerUpdate
              : customer
          )
        );
      }

      if (notification.customerData) {
        setCustomers((prev) =>
          prev.some((e) => e.id == notification.customerData?.id)
            ? prev
            : [...prev, notification.customerData!]
        );
      }

      if (notification.deleteCustomer) {
        setCustomers((prev) =>
          prev.filter((e) => e.id != notification.deleteCustomer?.id)
        );
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:8080/api/customer/get-all",
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: CustomerData[] = await response.json();
        setCustomers(data);
      } catch (err) {
        setError("Error loading data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.files);
    if (event.target.files) {
      const file = event.target.files[0];
      uploadFile(file);
    }
  };

  const uploadFile = async (uploadedFile: File) => {
    if (!uploadedFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const res = await fetch("http://localhost:8080/api/customer/bulk-upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);

    setCustomers([...customers, ...data.result.new]);

    alert(data.message || "Upload failed");
  };

  const updateStatus = async (
    id: string,
    status: "Paid" | "Overdue" | "Pending"
  ) => {
    const res = await fetch(
      "http://localhost:8080/api/customer/update-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      }
    );

    // const data = await res.json();
    // if (data.success) {
    // }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <TopBar setNotificationWindowOpen={setIsNotificationWindowOpen} />

      <div className="min-h-screen bg-gray-100 text-black p-6 flex flex-col h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>

          <div className="flex gap-4">
            <Link
              className="rounded-full border border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-200 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 min-w-36"
              type="submit"
              href={"/dashboard/create_customer"}
            >
              Create Customer
            </Link>

            <div className="relative">
              <input
                ref={fileInputRef}
                accept=".xls,.xlsx,.csv"
                type="file"
                className="absolute opacity-0 w-0 h-0"
                onChange={handleFileChange}
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="rounded-full border border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-200 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 min-w-36"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload File
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 justify-start">
          <h1 className="text-lg font-bold">Search</h1>

          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base h-10 sm:h-12 sm:px-6 min-w-36"
          />

          <h1 className="text-lg font-bold">Status</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base h-10 sm:h-12 sm:px-6 min-w-36"
          >
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Error & Loading States */}
        {loading && (
          <div className="text-center text-gray-500">
            <Loader className="animate-spin inline" size={24} /> Loading...
          </div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Table Section */}
        {!loading && !error && (
          <CustomersTable
            customers={customers}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          ></CustomersTable>
        )}

        <NotificationPanel
          isOpen={isOpen}
          setIsOpen={setIsNotificationWindowOpen}
        />
      </div>
    </div>
  );
}
