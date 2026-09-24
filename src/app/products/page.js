
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";
import { logoutUser } from "../../services/authService";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  deleteProduct,
} from "../../services/productService";
import ProductTable from "../../components/ProductTable";
import {
  getProductMutations,
  saveDeletedProduct,
} from "../../utils/productStorage";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // -----------------------------
  // URL values
  // -----------------------------

  const pageParam = Number(searchParams.get("page"));
  const limitParam = Number(searchParams.get("limit"));

  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const sortByParam = searchParams.get("sortBy") || "";
  const orderParam = searchParams.get("order") || "";

  const validSortFields = ["price", "rating", "title"];
  const validSortOrders = ["asc", "desc"];

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const limit = [10, 20, 50].includes(limitParam)
    ? limitParam
    : 20;

  const sortBy = validSortFields.includes(sortByParam)
    ? sortByParam
    : "";

  const order = validSortOrders.includes(orderParam)
    ? orderParam
    : "";

  // -----------------------------
  // Pagination
  // -----------------------------

  // IMPORTANT:
  // This must be outside loadProducts()
  // because it is also used in the JSX.
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // -----------------------------
  // Search state
  // -----------------------------

  const [searchInput, setSearchInput] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  // -----------------------------
  // Update URL
  // -----------------------------

  const updateUrl = (
    newPage,
    newLimit,
    newSearch = searchParam,
    newCategory = categoryParam,
    newSortBy = sortBy,
    newOrder = order
  ) => {
    const params = new URLSearchParams();

    params.set("page", String(newPage));
    params.set("limit", String(newLimit));

    const trimmedSearch = newSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSortBy && newOrder) {
      params.set("sortBy", newSortBy);
      params.set("order", newOrder);
    }

    router.push(`/products?${params.toString()}`);
  };

  // -----------------------------
  // Debounce search input
  // -----------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  // -----------------------------
  // Keep input synchronized
  // with URL
  // -----------------------------

  useEffect(() => {
    setSearchInput(searchParam);
    setDebouncedSearch(searchParam);
  }, [searchParam]);

  // -----------------------------
  // Update URL after search
  // -----------------------------

  useEffect(() => {
    if (debouncedSearch === searchParam) {
      return;
    }

    updateUrl(
      1,
      limit,
      debouncedSearch,
      categoryParam,
      sortBy,
      order
    );
  }, [debouncedSearch]);

  // -----------------------------
  // Load categories
  // -----------------------------

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  // -----------------------------
  // Load products
  // -----------------------------

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);

    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const skip = (page - 1) * limit;

        let data;

        // Category has priority
        if (categoryParam) {
          data = await getProductsByCategory({
            category: categoryParam,
            limit,
            skip,
            sortBy,
            order,
            signal: controller.signal,
          });
        }

        // Search
        else if (searchParam) {
          data = await searchProducts({
            query: searchParam,
            limit,
            skip,
            signal: controller.signal,
          });
        }

        // Normal products
        else {
          data = await getProducts({
            limit,
            skip,
            sortBy,
            order,
            signal: controller.signal,
          });
        }

        // -----------------------------
        // Apply local mutations
        // -----------------------------

        const mutations = getProductMutations();

        const deletedIds = new Set(
          (mutations.deleted || []).map((id) => Number(id))
        );

        const updatedMap = mutations.updated || {};

        const updatedProducts = (data.products || [])
          .map((product) => {
            const updatedProduct =
              updatedMap[String(product.id)];

            return updatedProduct
              ? {
                  ...product,
                  ...updatedProduct,
                }
              : product;
          })
          .filter(
            (product) =>
              !deletedIds.has(Number(product.id))
          );

        const addedProducts = (
          mutations.added || []
        ).filter(
          (product) =>
            !deletedIds.has(Number(product.id))
        );

        const finalProducts = [
          ...addedProducts,
          ...updatedProducts,
        ];

        setProducts(finalProducts);

        const finalTotal =
          Number(data.total || 0) +
          addedProducts.length;

        setTotal(finalTotal);

        // -----------------------------
        // Correct invalid page
        // -----------------------------

        const calculatedTotalPages = Math.ceil(
          finalTotal / limit
        );

        if (
          calculatedTotalPages > 0 &&
          page > calculatedTotalPages
        ) {
          updateUrl(
            calculatedTotalPages,
            limit,
            searchParam,
            categoryParam,
            sortBy,
            order
          );
        }
      } catch (error) {
        // Ignore cancelled requests
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED" ||
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(error);
        setError("Failed to load products.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [
    router,
    page,
    limit,
    searchParam,
    categoryParam,
    sortBy,
    order,
    retryCount,
  ]);

  // -----------------------------
  // Logout
  // -----------------------------

  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  // -----------------------------
  // Delete product
  // -----------------------------

  const handleDelete = async () => {
    if (!productToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      const productId = productToDelete.id;

      const isLocalProduct =
        String(productId).startsWith("local-");

      if (isLocalProduct) {
        const mutations = getProductMutations();

        const updatedMutations = {
          ...mutations,
          added: (mutations.added || []).filter(
            (product) => product.id !== productId
          ),
        };

        localStorage.setItem(
          "productMutations",
          JSON.stringify(updatedMutations)
        );
      } else {
        await deleteProduct(productId);

        saveDeletedProduct(productId);
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );

      setTotal((currentTotal) =>
        Math.max(currentTotal - 1, 0)
      );

      setProductToDelete(null);
    } catch (error) {
      console.error(error);
      setError("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  // -----------------------------
  // Authentication loading
  // -----------------------------

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Checking authentication...
        </p>
      </main>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            Product Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push("/products/new")
              }
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              + Add Product
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-6">
        <h2 className="mb-6 text-2xl font-bold">
          Products
        </h2>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-lg border bg-white px-4 py-2 outline-none focus:ring-2 md:max-w-md"
          />

          {/* Category */}
          <select
            value={categoryParam}
            onChange={(event) => {
              const newCategory =
                event.target.value;

              updateUrl(
                1,
                limit,
                searchParam,
                newCategory,
                sortBy,
                order
              );
            }}
            className="rounded-lg border bg-white px-4 py-2 outline-none focus:ring-2"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.slug}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            value={
              sortBy && order
                ? `${sortBy}-${order}`
                : ""
            }
            onChange={(event) => {
              const value = event.target.value;

              if (!value) {
                updateUrl(
                  1,
                  limit,
                  searchParam,
                  categoryParam,
                  "",
                  ""
                );

                return;
              }

              const [
                newSortBy,
                newOrder,
              ] = value.split("-");

              updateUrl(
                1,
                limit,
                searchParam,
                categoryParam,
                newSortBy,
                newOrder
              );
            }}
            className="rounded-lg border bg-white px-4 py-2 outline-none focus:ring-2"
          >
            <option value="">Sort By</option>

            <option value="price-asc">
              Price: Low to High
            </option>

            <option value="price-desc">
              Price: High to Low
            </option>

            <option value="rating-asc">
              Rating: Low to High
            </option>

            <option value="rating-desc">
              Rating: High to Low
            </option>

            <option value="title-asc">
              Title: A to Z
            </option>

            <option value="title-desc">
              Title: Z to A
            </option>
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              {error}
            </p>

            <button
              onClick={() =>
                setRetryCount(
                  (count) => count + 1
                )
              }
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center">
              <p className="text-gray-500">
                No products found.
              </p>
            </div>
          )}

        {/* Table */}
        {!isLoading &&
          !error &&
          products.length > 0 && (
            <ProductTable
              products={products}
              onDelete={(product) => {
                setProductToDelete(product);
              }}
            />
          )}

        {/* Pagination */}
        {!isLoading &&
          !error &&
          products.length > 0 && (
            <div className="mt-6 flex flex-col gap-4 rounded-lg bg-white p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-600">
                Showing{" "}
                {(page - 1) * limit + 1}–
                {Math.min(
                  page * limit,
                  total
                )}{" "}
                of {total}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {/* Page size */}
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
                    updateUrl(
                      1,
                      Number(
                        event.target.value
                      ),
                      searchParam,
                      categoryParam,
                      sortBy,
                      order
                    );
                  }}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option value={10}>
                    10
                  </option>
                  <option value={20}>
                    20
                  </option>
                  <option value={50}>
                    50
                  </option>
                </select>

                {/* Previous */}
                <button
                  onClick={() =>
                    updateUrl(
                      page - 1,
                      limit,
                      searchParam,
                      categoryParam,
                      sortBy,
                      order
                    )
                  }
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => {
                    const pageNumber =
                      index + 1;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() =>
                          updateUrl(
                            pageNumber,
                            limit,
                            searchParam,
                            categoryParam,
                            sortBy,
                            order
                          )
                        }
                        className={`rounded-lg px-3 py-2 text-sm ${
                          pageNumber === page
                            ? "bg-black text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    updateUrl(
                      page + 1,
                      limit,
                      searchParam,
                      categoryParam,
                      sortBy,
                      order
                    )
                  }
                  disabled={page >= totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
      </section>

      {/* Delete confirmation modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {productToDelete.title}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setProductToDelete(null)
                }
                disabled={isDeleting}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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
