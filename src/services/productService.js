import api from "./api";

export const getProducts = async ({ limit = 20, skip = 0 } = {}) => {
    
  const response = await api.get("/products", {
    params: {
      limit,
      skip,
    },
  });
console.log(response.data)
  return response.data;
};