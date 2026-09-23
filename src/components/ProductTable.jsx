export default function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}