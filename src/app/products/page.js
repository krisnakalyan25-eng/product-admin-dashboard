"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";
import { logoutUser } from "../../services/authService";
import { getProducts } from "../../services/productService";
import ProductTable from "../../components/ProductTable";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts({
          limit: 20,
          skip: 0,
        });

        setProducts(data.products);
      } catch (error) {
        console.error(error);
        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking authentication...</p>
      </main>
    );
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
        <h2 className="mb-6 text-2xl font-bold">
          Products
        </h2>

        {isLoading && (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-red-600">
              {error}
            </p>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray-500">
              No products found.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <ProductTable products={products} />
        )}
      </section>
    </main>
  );
}