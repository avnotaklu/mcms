"use-client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserActions() {
  const [open, setOpen] = useState(false);
  const { email, setEmail, logOut } = useAuth();

  console.log("email", email);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  //   useEffect(() => {
  //     function handleClickOutside(event) {
  //       if (menuRef.current && !menuRef.current.contains(event.target)) {
  //         setOpen(false);
  //       }
  //     }
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-700">{email}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Popup Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
            onClick={logOut}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
