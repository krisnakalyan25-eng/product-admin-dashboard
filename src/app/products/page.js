"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";
import { logoutUser } from "../../services/authService";
import { getProducts } from "../../services/productService";
import ProductTable from "../../components/ProductTable";

function ProductsContent()  {
  const router = useRouter();
const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
 // const [limit, setLimit] = useState(20);
const [total, setTotal] = useState(0);

const pageParam = Number(searchParams.get("page"));
const limitParam = Number(searchParams.get("limit"));

const page =
  Number.isInteger(pageParam) && pageParam > 0
    ? pageParam
    : 1;

const limit =
  [10, 20, 50].includes(limitParam)
    ? limitParam
    : 20;

    const updateUrl = (newPage, newLimit) => {
  const params = new URLSearchParams();

  params.set("page", newPage);
  params.set("limit", newLimit);

  router.push(`/products?${params.toString()}`);
};

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

        // const data = await getProducts({
        //   limit: 20,
        //   skip: 0,
        // });
        const skip = (page - 1) * limit;

          const data = await getProducts({
            limit,
            skip,
          });

        setProducts(data.products);
        setTotal(data.total);

        const totalPages = Math.ceil(data.total / limit);

      if (page > totalPages && totalPages > 0) {
        router.replace(
          `/products?page=${totalPages}&limit=${limit}`
        );
      }
      } catch (error) {
        console.error(error);
        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [router,page,limit,searchParams]);

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
        {!isLoading && !error && products.length > 0 && (
  <div className="mt-6 flex flex-col gap-4 rounded-lg bg-white p-4 md:flex-row md:items-center md:justify-between">
    <p className="text-sm text-gray-600">
      Showing{" "}
      {(page - 1) * limit + 1}–
      {Math.min(page * limit, total)} of {total}
    </p>

    <div className="flex items-center gap-2">
       <label
    htmlFor="pageSize"
    className="text-sm text-gray-600"
  >
    Page size:
  </label>

  <select
    id="pageSize"
    value={limit}
    onChange={(event) => {
    updateUrl(1, Number(event.target.value));
    }}
    className="rounded-lg border px-3 py-2 text-sm"
  >
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
  </select>
      <button
      onClick={() => updateUrl(page - 1, limit)}
        disabled={page === 1}
        className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-3 text-sm font-medium">
        Page {page}
      </span>

      <button
        onClick={() => updateUrl(page + 1, limit)}
        disabled={page * limit >= total}
        className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
)}
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-600">
            Loading products...
          </p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}