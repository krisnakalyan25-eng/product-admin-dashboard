import api from "./api";

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  const data = response.data;

  if (typeof window !== "undefined" && data.accessToken) {
    localStorage.setItem("authToken", data.accessToken);
  }

  return data;
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};