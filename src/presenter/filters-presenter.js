import FiltersFormView from '../view/filters-form-view';
import { render } from '../framework/render';
import { createFilter } from '../mocks/filter';

export default class FiltersPresenter{
  #filtersContainer = null;
  #waypoints = null;
  constructor({filtersContainer, waypointsListModel }){
    this.#filtersContainer = filtersContainer;
    this.#waypoints = waypointsListModel.waypoints;
  }

  init(){
    const filters = createFilter(this.#waypoints);
    render(new FiltersFormView({filters}), this.#filtersContainer);
  }
}

