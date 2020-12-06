import axios from "axios";
import { key, url } from "../views/base";

export default class Recipie {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${url}/${this.id}/information?includeNutrition=false&apiKey=${key}`);
      this.title = res.data.title;
      this.publisher = res.data.sourceName;
      this.image = res.data.image;
      this.ingredients = res.data.extendedIngredients;
      this.time = res.data.readyInMinutes;
      this.servings = res.data.servings;
      this.sourceUrl = res.data.sourceUrl;

    } catch (error) {
      console.log(error);
    }
  }

  parseIngredients() {
    let obj;
    const parsedIngredients = this.ingredients.map(e => {
      obj = {
        count: e.measures.us.amount,
        unit: e.measures.us.unitShort,
        name: e.name
      }
      return obj;
    });
    this.ingredients = parsedIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1
    
    // Ingredients
    this.ingredients.map(ing => {
      ing.count = type === 'dec' ? `${ing.count <= 0.5 ? 0.5 : ing.count-0.5}` : +ing.count+0.5
    });

    this.servings = newServings;
  }
}