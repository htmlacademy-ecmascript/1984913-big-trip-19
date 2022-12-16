import WaypointView from '../view/waypoint-view';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition } from '../render';
import TripInfoView from '../view/trip-info-view';
export default class ListPresenter{
  #headerContainer = null;
  #filtersContainer = null;
  #eventsContainer = null;
  #waypointsListModel = null;

  #eventsListComponent = new EventsListView();

  #waypoints = null;

  constructor({headerContainer, filtersContainer,eventsContainer, waypointsListModel }){
    this.#headerContainer = headerContainer;
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
  }

  init(){
    this.#waypoints = [...this.#waypointsListModel.waypoints];
    render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new FiltersView(), this.#filtersContainer);
    render(new SortingView(), this.#eventsContainer);
    render(new EventFormView({waypoint:this.#waypoints[0]}), this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
    for(let i = 1; i < this.#waypoints.length; i++){
      render(new WaypointView({waypoint:this.#waypoints[i]}), this.#eventsListComponent.element);
    }
    render(this.#eventsListComponent, this.#eventsContainer);
  }

}

