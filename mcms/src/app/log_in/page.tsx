"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/auth_schema";
import { useAuth } from "../context/AuthContext";

const API_END_POINT = process.env.API_END_POINT || "http://localhost:8080";

export default function LogInPage() {
  console.log("Testing on api", API_END_POINT);

  const router = useRouter();
  const { email, setEmail } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  async function signIn(data: any) {
    try {
      const { email, password } = data;

      let response = await fetch(`${API_END_POINT}/api/user/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setEmail(email);

        localStorage.setItem("email", email);
        router.replace("/dashboard");
        reset();
      } else {
        const error = (await response.json())?.errors?.at(0)?.msg;

        if (error) {
          throw new Error(`A failure occured: ${error}`);
        }

        if (!response.ok) throw new Error("Failed to create account");
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      <header className="items-center h-16 text-gray-900 text-2xl font-bold">
        Log In
      </header>
      <form
        onSubmit={handleSubmit(signIn)}
        className="flex flex-col gap-4 items-center"
      >
        <div className="w-full">
          <input
            {...register("email")}
            placeholder="Enter Name..."
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <input
            {...register("password")}
            placeholder="Enter Name..."
            type="password"
            className={`w-full px-4 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          className="rounded-full border border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-200 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 min-w-36"
          type="submit"
        >
          Sign In
        </button>
      </form>
      <Link
        className="transition-colors flex items-center justify-center hover:underline text-blue-500"
        href="/register"
      >
        Register New User
      </Link>
    </div>
  );
}
