import React, { useState, useEffect } from "react";
import { AppContext } from "./App_Context";
import axios from "axios";

const App_State = (props) => {
  const url = "http://localhost:3000/api";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [reload, setReload] = useState(true);
  const [recipe, setRecipe] = useState([]);
  const [savedRecipe, setSavedRecipe] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRecipe, setUserRecipe] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -------------------- FETCH RECIPE --------------------
  const fetchRecipe = async () => {
    try {
      const api = await axios.get(`${url}/`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setRecipe(api.data.recipe);
    } catch (err) {
      console.error("Fetch recipe error:", err.response?.data || err.message);
    }
  };

  // -------------------- FETCH SAVED RECIPE --------------------
  const getSavedRecipeById = async () => {
    try {
      const api = await axios.get(`${url}/saved`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setSavedRecipe(api.data.recipe);
    } catch (err) {
      console.error("Get saved recipe error:", err.response?.data || err.message);
    }
  };

  // -------------------- PROFILE --------------------
  const profile = async () => {
    try {
      const api = await axios.get(`${url}/user`, {
        headers: {
          "Content-Type": "application/json",
          Auth: token,
        },
        withCredentials: true,
      });

      if (api.data.user) {
        setUserId(api.data.user._id);
        setUser(api.data.user);
      }
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
    }
  };

  // -------------------- RECIPE BY USER --------------------
  const recipeByUser = async (id) => {
    try {
      const api = await axios.get(`${url}/user/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUserRecipe(api.data.recipe);
    } catch (err) {
      console.error("User recipe fetch error:", err.response?.data || err.message);
    }
  };

  // -------------------- LOGIN --------------------
  const login = async (gmail, password) => {
    try {
      const api = await axios.post(
        `${url}/login`,
        { gmail, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setToken(api.data.token);
      setIsAuthenticated(true);
      return api;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  // -------------------- REGISTER --------------------
  const register = async (name, gmail, password) => {
    try {
      const api = await axios.post(
        `${url}/register`,
        { name, gmail, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return api;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err;
    }
  };

  // -------------------- ADD RECIPE --------------------
  const addRecipe = async (
    title,
    ist,
    ing1,
    ing2,
    ing3,
    ing4,
    qty1,
    qty2,
    qty3,
    qty4,
    imgurl
  ) => {
    try {
      const api = await axios.post(
        `${url}/add`,
        { title, ist, ing1, ing2, ing3, ing4, qty1, qty2, qty3, qty4, imgurl },
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      setReload(!reload);
      return api;
    } catch (err) {
      console.error("Add recipe error:", err.response?.data || err.message);
      throw err;
    }
  };

  // -------------------- GET RECIPE BY ID --------------------
  const getRecipeById = async (id) => {
    try {
      const api = await axios.get(`${url}/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return api;
    } catch (err) {
      console.error("Get recipe by ID error:", err.response?.data || err.message);
    }
  };

  // -------------------- SAVE RECIPE --------------------
  const savedRecipeById = async (id) => {
    try {
      const api = await axios.post(
        `${url}/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        }
      );
      setReload(!reload);
      return api;
    } catch (err) {
      console.error("Save recipe error:", err.response?.data || err.message);
    }
  };

  // -------------------- LOGOUT --------------------
  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    const fetchData = async () => {
      await fetchRecipe();
      await getSavedRecipeById();
      if (token) {
        await profile();
      }
    };
    fetchData();
  }, [token, reload]);

  useEffect(() => {
    if (userId) {
      recipeByUser(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      const tokenFromLocalStorage = localStorage.getItem("token");
      if (tokenFromLocalStorage) {
        setToken(tokenFromLocalStorage);
        setIsAuthenticated(true);
      }
    }
  }, [token]);

  // -------------------- CONTEXT --------------------
  return (
    <AppContext.Provider
      value={{
        login,
        register,
        addRecipe,
        recipe,
        getRecipeById,
        savedRecipeById,
        savedRecipe,
        userRecipe,
        logOut,
        user,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default App_State;
