"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";
import { addProduct } from "../../../services/productService";
import { saveAddedProduct } from "../../../utils/productStorage";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated()) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
        setError("Product title is required.");
        return;
        }

        if (!price || Number(price) <= 0) {
        setError("Price must be greater than 0.");
        return;
        }

        if (!category.trim()) {
        setError("Category is required.");
        return;
        }

        if (stock === "" || Number(stock) < 0) {
        setError("Stock cannot be negative.");
        return;
        }
    try {
      setIsSaving(true);

      const productData = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
        description: description.trim(),
      };

      const createdProduct = await addProduct(productData);
        saveAddedProduct(createdProduct);
            console.log("Created product:", createdProduct);

            router.push("/products");
           
    } catch (error) {
      console.error(error);
      setError("Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.back()}
          className="mb-6 rounded-lg border bg-white px-4 py-2"
        >
          ← Back
        </button>

        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">
            Add Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium"
              >
                Product Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter product title"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="mb-1 block text-sm font-medium"
              >
                Price
              </label>

              <input
                id="price"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Enter category"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-1 block text-sm font-medium"
              >
                Stock
              </label>

              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                placeholder="Enter stock"
                min="0"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter product description"
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}