import { elements } from "./base";

export const renderItem = item => {
  const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
    <div class="shopping__count">
        <input type="number" value="${item.count}" step="${item.count}" class='editCountValue'>
        <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredient}</p>
    <button class="shopping__delete btn-tiny">
        <svg>
            <use href="img/icons.svg#icon-circle-with-cross"></use>
        </svg>
    </button>
  </li>
  `;
  elements.shopping.insertAdjacentHTML('beforeend', markup);
}

export const deleteItem = id => {
  const item = document.querySelector(`[data-itemid="${id}"]`);
  if(item) item.parentElement.removeChild(item);
};

export const toggleClearBtn = items => {
  elements.clearBtn.style.visibility = items > 0 ? 'visible' : 'hidden';
};

export const clearListView = () => {
  elements.shopping.innerHTML = '';
}