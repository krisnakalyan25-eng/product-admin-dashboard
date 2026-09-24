// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { isAuthenticated } from "../../../../utils/auth";
// import {
//   getProductById,
//   updateProduct,
// } from "../../../../services/productService";
// import { getProductMutations,saveUpdatedProduct } from "../../../../utils/productStorage";

// export default function EditProductPage() {
//   const params = useParams();
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [stock, setStock] = useState("");
//   const [description, setDescription] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.replace("/login");
//       return;
//     }

//     const loadProduct = async () => {
//       try {
//         setIsLoading(true);
//         setError("");

//         const isLocalProduct = String(params.id).startsWith("local-");

//             let data;

//             if (isLocalProduct) {
//             const mutations = getProductMutations();

//             data = mutations.added.find(
//                 (product) => product.id === params.id
//             );

//             if (!data) {
//                 throw new Error("Local product not found.");
//             }
//             } else {
//             data = await getProductById(params.id);
//             }

//             setTitle(data.title || "");
//             setPrice(data.price ?? "");
//             setCategory(data.category || "");
//             setStock(data.stock ?? "");
//             setDescription(data.description || "");
//       } catch (error) {
//         console.error(error);
//         setError("Product not found.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProduct();
//   }, [params.id, router]);

//   if (isLoading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center">
//         <p>Loading product...</p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <p className="mb-4 text-red-600">{error}</p>

//           <button
//             onClick={() => router.back()}
//             className="rounded-lg bg-black px-4 py-2 text-white"
//           >
//             Go Back
//           </button>
//         </div>
//       </main>
//     );
//   }

//   const handleSubmit = async (event) => {
//   event.preventDefault();

//   setError("");

//   if (!title.trim()) {
//     setError("Product title is required.");
//     return;
//   }

//   if (!price || Number(price) <= 0) {
//     setError("Price must be greater than 0.");
//     return;
//   }

//   if (!category.trim()) {
//     setError("Category is required.");
//     return;
//   }

//   if (stock === "" || Number(stock) < 0) {
//     setError("Stock cannot be negative.");
//     return;
//   }

//   if (isSaving) {
//     return;
//   }

//   try {
//     setIsSaving(true);

//     const productData = {
//       title: title.trim(),
//       price: Number(price),
//       category: category.trim(),
//       stock: Number(stock),
//       description: description.trim(),
//     };

//     const isLocalProduct = String(params.id).startsWith("local-");

//                if (isLocalProduct) {
//                 const localProduct = {
//                     id: params.id,
//                     title: productData.title,
//                     price: productData.price,
//                     category: productData.category,
//                     stock: productData.stock,
//                     description: productData.description,
//                 };

//                 saveUpdatedProduct(localProduct);

//                 router.push(`/products/${params.id}`);
//                 return;
//                 }
//         const updatedProduct = await updateProduct(params.id, productData);

//         saveUpdatedProduct(updatedProduct);

//         console.log("Updated product:", updatedProduct);

//         router.push(`/products/${params.id}`);
//         } catch (error) {
//             console.error(error);
//             setError("Failed to update product.");
//         } finally {
//             setIsSaving(false);
//         }
//         };

//   return (
//     <main className="min-h-screen bg-gray-100 p-6">
//       <div className="mx-auto max-w-2xl">
//         <button
//           onClick={() => router.back()}
//           className="mb-6 rounded-lg border bg-white px-4 py-2"
//         >
//           ← Back
//         </button>

//         <div className="rounded-xl bg-white p-6 shadow">
//           <h1 className="mb-6 text-2xl font-bold">
//             Edit Product
//           </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="title"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Product Title
//               </label>

//               <input
//                 id="title"
//                 type="text"
//                 value={title}
//                 onChange={(event) => setTitle(event.target.value)}
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="price"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Price
//               </label>

//               <input
//                 id="price"
//                 type="number"
//                 value={price}
//                 onChange={(event) => setPrice(event.target.value)}
//                 min="0"
//                 step="0.01"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="category"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Category
//               </label>

//               <input
//                 id="category"
//                 type="text"
//                 value={category}
//                 onChange={(event) => setCategory(event.target.value)}
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="stock"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Stock
//               </label>

//               <input
//                 id="stock"
//                 type="number"
//                 value={stock}
//                 onChange={(event) => setStock(event.target.value)}
//                 min="0"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="description"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Description
//               </label>

//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(event) => setDescription(event.target.value)}
//                 rows={4}
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//             </div>

//             {error && (
//                 <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
//                     {error}
//                 </p>
//                 )}

//             <button
//                 type="submit"
//                 disabled={isSaving}
//                 className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                 {isSaving ? "Updating..." : "Update Product"}
//                 </button>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAuthenticated } from "../../../../utils/auth";
import {
  getProductById,
  updateProduct,
} from "../../../../services/productService";
import {
  getProductMutations,
  saveUpdatedProduct,
} from "../../../../utils/productStorage";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --------------------------------
  // Load product
  // --------------------------------

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

        if (isLocalProduct) {
          const mutations = getProductMutations();

          data = mutations.added.find(
            (product) => product.id === params.id
          );

          if (!data) {
            throw new Error("Local product not found.");
          }
        } else {
          data = await getProductById(params.id);
        }

        setTitle(data.title || "");
        setPrice(data.price ?? "");
        setCategory(data.category || "");
        setStock(data.stock ?? "");
        setDescription(data.description || "");
      } catch (error) {
        console.error(error);
        setError("Product not found.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id, router]);

  // --------------------------------
  // Submit
  // --------------------------------

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

    if (isSaving) {
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

      const isLocalProduct =
        String(params.id).startsWith("local-");

      // --------------------------------
      // Local product
      // --------------------------------

      if (isLocalProduct) {
        const localProduct = {
          id: params.id,
          title: productData.title,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          description: productData.description,
        };

        saveUpdatedProduct(localProduct);

        // Return to products list
        router.push("/products");
        return;
      }

      // --------------------------------
      // API product
      // --------------------------------

      const updatedProduct = await updateProduct(
        params.id,
        productData
      );

      saveUpdatedProduct(updatedProduct);

      console.log("Updated product:", updatedProduct);

      // Return to products list
      router.push("/products");
    } catch (error) {
      console.error(error);
      setError("Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading product...</p>
      </main>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.back()}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

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
            Edit Product
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Title */}
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
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Price */}
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
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                min="0"
                step="0.01"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Category */}
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
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Stock */}
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
                onChange={(event) =>
                  setStock(event.target.value)
                }
                min="0"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Description */}
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
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Updating..."
                : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

