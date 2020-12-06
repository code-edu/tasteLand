import { elements, urlImg } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchRespages.innerHTML = '';
}



export const limitRecipieTitle = (title, limit = 17) => {
  if (title.length > limit) {
    return `${title.slice(0, limit)}...`;
  }
  return title;
}

const renderRecipe = recipe => {
  const markup = `
  <li>
    <a class="results__link" href="#${recipe.id}">
      <figure class="results__fig">
          <img src="${urlImg}${recipe.image}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipieTitle(recipe.title)}</h4>
          <p class="results__author">Ready in ${recipe.readyInMinutes} minutes.</p>
      </div>
    </a>
  </li>`;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.map(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};


// type 'prev' or 'next'

const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right' }"></use>
      </svg>
  </button>
`;


// Render buttons according to the page
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //Button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //Both buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    //Only button to go to prev page
    button = createButton(page, 'prev');
  }

  elements.searchRespages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render search results
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};