"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NotificationType } from "../dashboard/notifications/notification_schema";
import { useRouter } from "next/navigation";

const WS_URL = "ws://localhost:8080";

interface AuthContextType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const logOut = () => {
    setEmail("");
    localStorage.removeItem("email");

    fetch("http://localhost:8080/api/user/log-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    router.replace("/log_in");
  };

  useEffect(() => {
    const userData = localStorage.getItem("email");

    if (userData) {
      try {
        setEmail(userData);
      } catch (error) {
        console.error("Error parsing user_context cookie:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ email, setEmail, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
