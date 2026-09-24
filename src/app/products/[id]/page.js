"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";
import { getProductById } from "../../../services/productService";
import {
  getProductMutations,
} from "../../../utils/productStorage";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const isLocalProduct =
          String(params.id).startsWith("local-");

        let data;

        // Local product → get it from localStorage
        if (isLocalProduct) {
          const mutations = getProductMutations();

          data = mutations.added.find(
            (product) => product.id === params.id
          );

          if (!data) {
            throw new Error("Local product not found.");
          }
        } else {
          // API product → get it from DummyJSON
          data = await getProductById(params.id);

          // Apply locally saved edits if this API product was edited
          const mutations = getProductMutations();
          const updatedProduct =
            mutations.updated?.[params.id];

          if (updatedProduct) {
            data = {
              ...data,
              ...updatedProduct,
            };
          }
        }

        setProduct(data);
      } catch (error) {
        console.error(error);
        setError("Product not found.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            We couldn't find a product with this ID.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
          >
            ← Back
          </button>

          <button
            onClick={() =>
              router.push(`/products/${params.id}/edit`)
            }
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Edit Product
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div>
              {product.images?.length > 0 ? (
                <>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-80 w-full rounded-lg object-contain"
                  />

                  <div className="mt-4 flex gap-3 overflow-x-auto">
                    {product.images.map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={product.title}
                        className="h-20 w-20 rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <h1 className="mb-3 text-3xl font-bold">
                {product.title}
              </h1>

              <p className="mb-4 text-gray-600">
                {product.description}
              </p>

              <div className="mb-4 text-2xl font-bold">
                ${product.price}
              </div>

              <div className="mb-2">
                    Rating: ⭐ {product.rating ?? "N/A"} / 5
                    </div>

              <div className="mb-6">
                Stock: {product.stock}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {product.category}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  Brand: {product.brand || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Reviews
          </h2>

          {product.reviews?.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div
                  key={`${review.reviewerEmail}-${index}`}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">
                      {review.reviewerName}
                    </h3>

                    <span className="text-sm">
                      ⭐ {review.rating}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-600">
                    {review.comment}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(
                      review.date
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No reviews available.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}