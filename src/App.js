import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [dishName, setDishName] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [menuDishes, setMenuDishes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://localhost:7105/api/Recipe/menu")
      .then((res) => setMenuDishes(res.data))
      .catch((err) => console.error("Failed to load menu dishes", err));
  }, []);

  const fetchRecipe = (name) => {
    if (!name.trim()) {
      setError("Please select a dish.");
      setRecipe(null);
      return;
    }

    axios
      .get(`https://localhost:7105/api/Recipe/search?name=${encodeURIComponent(name)}`)
      .then((response) => {
        const recipes = response.data;
        if (Array.isArray(recipes) && recipes.length > 0 && recipes[0].steps?.length > 0) {
          setRecipe(recipes[0]);
          setError("");
        } else {
          setRecipe(null);
          setError("No steps found for that dish.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch the recipe steps.");
        setRecipe(null);
      });
  };

  const handleMenuClick = (name) => {
    setDishName(name);
    fetchRecipe(name);
    setMenuOpen(false);
  };

  return (
    <div className="App">
      {/* Dish Menu Bar */}
      <nav className="navbar">
        <div
          className="menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen((prev) => !prev)}
        >
          Dish Menu ▼
        </div>
        {menuOpen && (
          <ul className="dropdown-menu">
            {menuDishes.length > 0 ? (
              menuDishes.map((dish) => (
                <li
                  key={dish.id}
                  onClick={() => handleMenuClick(dish.name)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleMenuClick(dish.name)}
                >
                  {dish.name}
                </li>
              ))
            ) : (
              <li>No dishes available</li>
            )}
          </ul>
        )}
      </nav>

      <h1>🍽️ How to Cook a Dish</h1>

      {error && <p className="error">{error}</p>}

      {recipe && (
        <>
          <h2 className="dish-name">{dishName}</h2>
          
          {recipe.imageUrl && (
            <div className="image-container">
              <img
                src={`https://localhost:7105${recipe.imageUrl}`}
                alt={recipe.name}
                style={{ maxWidth: "300px", margin: "20px auto" }}
              />
            </div>
          )}

          <ol className="recipe-list">
            {recipe.steps.map((step) => (
              <li key={step.stepNumber}>
                <strong>Step {step.stepNumber}:</strong> {step.instruction}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default App;