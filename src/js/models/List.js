import { uuidv4 } from "../views/base";

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uuidv4(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    this.persistData();
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1);
    this.persistData();
  }

  deleteAllItems() {
    localStorage.removeItem('items');
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
    this.persistData();
  } 

  persistData() {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('items'));
    // Getting items from the storage
    if (storage) this.items = storage; 
  }

  getNumItems() {
    return this.items.length;
  }
}
