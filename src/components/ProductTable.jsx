export default function ProductTable({ products, onDelete }) {
  return (
    <>
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
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded object-cover"
                  />

                  <span className="font-medium">
                    {product.title}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3">
                {product.category}
              </td>

              <td className="px-4 py-3">
                ${product.price}
              </td>

              <td className="px-4 py-3">
                ⭐ {product.rating}
              </td>

              <td className="px-4 py-3">
                {product.stock}
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
     <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex gap-4">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-20 w-20 rounded-lg object-cover"
              />

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
                <p className="font-medium">{product.rating}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-2">
                <span className="text-gray-500">Stock</span>
                <p className="font-medium">{product.stock}</p>
              </div>
            </div>

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