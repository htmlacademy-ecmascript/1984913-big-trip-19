import FiltersFormView from '../view/filters-form-view';
import {render, replace, remove} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import { FilterType, UpdateType } from '../consts';
export default class FiltersPresenter{
  #filtersContainer = null;
  #filtersModel = null;
  #waypointsListModel = null;

  #filtersComponent = null;

  constructor({filtersContainer, filtersModel, waypointsListModel }){
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#waypointsListModel = waypointsListModel;

    this.#waypointsListModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters(){
    const waypoints = this.#waypointsListModel.waypoints;

    return[{
      type: FilterType.EVERYTHING,
      name: 'EVERYTHING',
      isDisabled:!(filter[FilterType.EVERYTHING](waypoints).length > 0),
    },{
      type: FilterType.FUTURE,
      name: 'FUTURE',
      isDisabled:!(filter[FilterType.FUTURE](waypoints).length > 0),
    },{
      type: FilterType.PRESENT,
      name: 'PRESENT',
      isDisabled:!(filter[FilterType.PRESENT](waypoints).length > 0),
    },{
      type: FilterType.PAST,
      name: 'PAST',
      isDisabled:!(filter[FilterType.PAST](waypoints).length > 0),
    }];
  }

  init(){
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersFormView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange:this.#handleFilterTypeChange
    });

    if(prevFiltersComponent === null) {
      render(this.#filtersComponent , this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

