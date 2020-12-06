export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.searchTerm'),
  searchResList: document.querySelector('.results__list'),
  searchRes: document.querySelector('.results'),
  searchRespages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list'),
  clearBtn: document.querySelector('.btn_clear')
}

export const elementStrings = {
  loader: 'loader'
};

export const renderLoader = parent => {
  const loader = `
    <div class='${elementStrings.loader}'>
      <svg>
        <use href='img/icons.svg#icon-cw'></use>
      </svg>
    </div>  
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if(loader) loader.parentElement.removeChild(loader);
}

// generate uniqu id
export const  uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const url = 'https://api.spoonacular.com/recipes';
export const key = '1efd60bace39445b97e71b0bfc4cc81c';
export const urlImg = 'https://spoonacular.com/recipeImages/';