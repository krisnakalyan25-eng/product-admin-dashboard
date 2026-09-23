"use client";

import { useState } from "react";
import { loginUser } from "./services/authService";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser("emilys", "emilyspass");

      console.log(data);
      setMessage("Login successful");
    } catch (error) {
      console.error(error);
      setMessage("Login failed");
    }
  };

  return (
    <main className="p-10">
      <button
        onClick={handleLogin}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Test Login
      </button>

      <p className="mt-4">{message}</p>
    
    </main>
  );
}