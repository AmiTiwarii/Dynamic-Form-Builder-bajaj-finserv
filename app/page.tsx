"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import DynamicForm from "@/components/DynamicForm";
import type { FormResponse } from "@/types/form";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ rollNumber: "", name: "" });
  const [formData, setFormData] = useState<FormResponse | null>(null);

  const handleLoginSuccess = async (rollNumber: string, name: string) => {
    setUserData({ rollNumber, name });
    setIsLoggedIn(true);

    try {
      const response = await fetch(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch form data");
      }

      const data: FormResponse = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching form:", error);
      alert("Failed to fetch form data. Please try again.");
      setIsLoggedIn(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : formData ? (
          <DynamicForm formData={formData} userData={userData} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </main>
  );
}
