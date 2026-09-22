
const BASE_URL = process.env.REACT_APP_MATHE_API;

export const logoutRequest = async () => {
    try {
      await fetch(BASE_URL + "auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

export const signIn = async (postData) => {
    try {
      const response = await fetch(BASE_URL + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };