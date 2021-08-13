const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const mealDetails = document.querySelector(".meal-details");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchInput = document.getElementById("search-input");
const loader = document.getElementById("loading");

// envent listners
searchBtn.addEventListener("click", getMealList);
searchInput.addEventListener("keyup", pressEnterKey);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetails.style.display = "none";
});
function pressEnterKey(event) {
  if (event.keyCode === 13) {
    getMealList();
    event.target.value = "";
  }
}

// get meal list
function getMealList() {
  displayLoading();
  let searchInputtext = document.getElementById("search-input").value.trim();

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputtext}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `<div class="meal-item" data-id="${meal.idMeal}">
              <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food pic" />
              </div>
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get recipe</a>
            </div>`;
          mealList.classList.remove("notFound");
        });
      } else {
        html = "Sorry, we did't find any meal!";
        mealList.classList.add("notFound");
      }
      hideLoading();
      mealList.innerHTML = html;
    });
  searchInput.value = "";
}

// get meal recipe
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.dataset.id;
    console.log(mealItem);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem}`)
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a model
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];

  let html = `<h2 class="recipe-title">${meal.strMeal}</h2>
          <p class="recipe-category">${meal.strCategory}</p>
         <div class = "recipe-instruct">
          <h3>Instructions:</h3>
         <p>${meal.strInstructions}</p>
          </div>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="food pic" />
        </div>
        <div class="recipe-link">
          <a href="${meal.strYouTube}" target="_blank">Watch Video</a>
        </div>`;
  mealDetailsContent.innerHTML = html;

  mealDetails.style.display = "block";
}

// showing loading
function displayLoading() {
  loader.style.visibility = "visible";
}

function hideLoading() {
  loader.style.visibility = "hidden";
}
