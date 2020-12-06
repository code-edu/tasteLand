import axios from "axios";
import { key, url } from "../views/base";

export default class Search {
  constructor(query, num) {
    this.query = query;
    this.num = num;
  }
  
  async getResults() {
    try {
      const res = await axios(`${url}/search?query=${this.query}&number=${this.num}&apiKey=${key}`);
      this.result = res.data.results;
    } catch (error) {
      alert(error);
    }
    
  }

}


