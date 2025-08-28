import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/App_Context";
import { Link, useLocation } from "react-router-dom";

const FetchRecipeById = ({ id }) => {
  const location = useLocation();
  const { getRecipeById } = useContext(AppContext);

  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await getRecipeById(id);
        setRecipe(result?.data?.recipe || {});
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, getRecipeById]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <h4>Loading recipe...</h4>
      </div>
    );
  }

  if (!recipe || !recipe.title) {
    return (
      <div className="text-center my-5">
        <h4>Recipe not found.</h4>
        <Link to="/" className="btn btn-warning mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        className="text-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="d-flex justify-content-center align-items-center p-3">
          <img
            src={recipe?.imgurl}
            className="card-img-top"
            alt={recipe?.title || "Recipe image"}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "10px",
              border: "2px solid yellow",
              objectFit: "cover",
            }}
          />
        </div>
        <h3>{recipe?.title}</h3>
      </div>

      {location.pathname !== "/saved" && (
        <>
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div className="left">
              <h4>{recipe?.ing1} - {recipe?.qty1}</h4>
              <h4>{recipe?.ing2} - {recipe?.qty2}</h4>
              <h4>{recipe?.ing3} - {recipe?.qty3}</h4>
              <h4>{recipe?.ing4} - {recipe?.qty4}</h4>
            </div>
            <div className="right" style={{ maxWidth: "500px" }}>
              {recipe?.ist}
            </div>
          </div>

          <Link to="/" className="btn btn-warning my-5">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
};

export default FetchRecipeById;
