import api from "./api";

export const getProducts = async ({
  limit = 20,
  skip = 0,
  signal,
} = {}) => {
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
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
  signal,
} = {}) => {
  const response = await api.get(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
      },
      signal,
    }
  );

  return response.data;
};