import api from "./api";

export const getProducts = async ({
  limit = 20,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) => {
  const response = await api.get("/products", {
    params: {
        limit,
        skip,
        sortBy,
        order,
      },
    signal,
  });

  return response.data;
};

export const searchProducts = async ({
  query,
  limit = 20,
  skip = 0,
  signal,
} = {}) => {
  const response = await api.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
    },
    signal,
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProductsByCategory = async ({
  category,
  limit = 20,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) => {
  const response = await api.get(
    `/products/category/${category}`,
    {
     params: {
        limit,
        skip,
        sortBy,
        order,
      },
      signal,
    }
  );

  return response.data;
};

export const getProductById = async (id, { signal } = {}) => {
  const response = await api.get(`/products/${id}`, {
    signal,
  });

  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post("/products/add", productData);

  return response.data;
};