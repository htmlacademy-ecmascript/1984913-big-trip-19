import FiltersView from '../view/filters-view';
import { render } from '../framework/render';

export default class FiltersPresenter{
  #filtersContainer = null;

  constructor({filtersContainer }){
    this.#filtersContainer = filtersContainer;
  }

  init(){
    render(new FiltersView(), this.#filtersContainer);
  }
}

