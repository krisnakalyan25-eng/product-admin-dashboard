"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth"; 
import { logoutUser } from "@/app/services/authService";

export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            Product Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-6">
        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <p className="mt-2 text-gray-600">
          Product management dashboard coming soon.
        </p>
      </section>
    </main>
  );
}