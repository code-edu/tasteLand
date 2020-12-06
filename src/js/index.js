import '../css/main.scss';
import '../img/icons.svg';
import '../img/favicon.png';
// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

//Global state of the app
const state = {};

window.state = state;

/*   SEARCH CONTROLER  */
const controlSerach = async () => {
  //Query from the view
  const query = searchView.getInput();
  const num = 30;
  console.log(query);
  
  if (query) {
    //New search objet add to state
    state.search = new Search(query, num);
    
    //Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    
    try {
      //Search for recepies
      await state.search.getResults();
      
      //Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
      //console.log(state.search.result);
    } catch (error) {
      console.log(error);
      clearLoader();
    }
  }
}

// Listening for search event (with query results)
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSerach();
}); 


// Listening on events regarding paggination buttons
elements.searchRespages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = +btn.dataset.goto;
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});


/*   RECIPIE CONTROLER  */
const controlRecipe = async () => {
  
  // Get ID from url 
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search
    if(state.search) searchView.highlightSelected(id);

    //Create new recipe Object 
    state.recipe = new Recipe(id);

    // Get recipe data and parse ingredients
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));    
    } catch (error) {
      console.log(error);
    }
  }
};

//window.addEventListener('hashchange', controlRecipe);

['hashchange', 'load'].map(event => window.addEventListener(event, controlRecipe));

//For testing
//state.likes = new Likes();
//likesView.toggleLikeMenu(state.likes.getNumLikes());

/*   LIKES CONTROLER  */
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  // User has NOT yet liked current recipe
  if(!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.publisher, state.recipe.image);

    // Toggle the like buttony
    likesView.toggleLikeBtn(true);
    // Add like to UI list 
    likesView.renderLike(newLike);
    console.log(state.likes);

  // User has liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
    console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

/*   LIST CONTROLER  */
const controlList  = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();


  // Add each ingredient to the list UI
  state.recipe.ingredients.map(el => {
    const item = state.list.addItem(el.count, el.unit, el.name);
    listView.renderItem(item);
  });
  
  listView.toggleClearBtn(state.list.getNumItems());
}

// Restore likes recipe when page loads 
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.list = new List();
  // Restore likes
  state.likes.readStorage();
  state.list.readStorage();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render exsisting likes 
  state.likes.likes.map(like => likesView.renderLike(like));
  // Render exsisting list items 
  state.list.items.map(item => listView.renderItem(item));

  listView.toggleClearBtn(state.list.getNumItems());  
});


//Clear all list items
elements.clearBtn.addEventListener('click', () => {
  state.list = new List();
  state.list.deleteAllItems();
  listView.clearListView();
});

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
    // Handle count update
  } else if (e.target.matches('.editCountValue')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe-btn-add, .recipe-btn-add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
  //console.log(state.recipe);
});

//window.l = new List();