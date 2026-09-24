


import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
                        <tr
            key={product.id}
            className="border-b last:border-b-0"
            >
            <td className="p-0">
                <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                >
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded object-cover"
                />
                <span className="font-medium">
                    {product.title}
                </span>
                </Link>
            </td>

            <td className="p-0">
                <Link
                href={`/products/${product.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
                >
                {product.category}
                </Link>
            </td>

            <td className="p-0">
                <Link
                href={`/products/${product.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
                >
                ${product.price}
                </Link>
            </td>

            <td className="p-0">
                <Link
                href={`/products/${product.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
                >
                ⭐ {product.rating ?? "N/A"}
                </Link>
            </td>

            <td className="p-0">
                <Link
                href={`/products/${product.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
                >
                {product.stock}
                </Link>
            </td>

            <td className="px-4 py-3">
                <button
                onClick={() => onDelete(product)}
                className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                Delete
                </button>
            </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            {/* Clickable product information */}
            <Link
              href={`/products/${product.id}`}
              className="block rounded-lg hover:bg-gray-50"
            >
              <div className="flex gap-4">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                    No image
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="mt-2 font-semibold">
                    ${product.price}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="text-gray-500">Rating</span>
                  <p className="font-medium">
                    ⭐ {product.rating ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="text-gray-500">Stock</span>
                  <p className="font-medium">
                    {product.stock}
                  </p>
                </div>
              </div>
            </Link>

            {/* Delete remains separate */}
            <button
              onClick={() => onDelete(product)}
              className="mt-4 w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
