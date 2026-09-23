export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};