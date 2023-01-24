import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition, remove } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import EmptyListView from '../view/empty-list-view';
import WaypointPresenter from './waypoint-presenter';
import { FilterType, SortType, UpdateType, UserAction} from '../consts';
import { sortWaypointByPrice, sortWaypontByTime, sortWaypointByDay } from '../utils/waypoint';
import NewWaypointPresenter from './new-waypoint-presenter';
import {filter} from '../utils/filter.js';

export default class ListPresenter{
  #headerContainer = null;
  #eventsContainer = null;

  #waypointsListModel = null;
  #filtersModel = null;

  #filterType = null;

  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #emptyListComponent = null;
  #tripInfoComponent = new TripInfoView();

  #waypointPresenter = new Map();
  #newWaypointPresenter = null;

  #destinations = null;
  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  constructor({headerContainer, eventsContainer,filtersModel, waypointsListModel, onNewWaypointDestroy }){
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
    this.#filtersModel = filtersModel;

    this.#waypointsListModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#newWaypointPresenter = new NewWaypointPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange:this.#handleViewAction,
      onDestroy:onNewWaypointDestroy,
      destinations:[...this.#waypointsListModel.destinations]
    });
  }

  get waypoints(){
    this.#filterType = this.#filtersModel.filter;
    const waypoints = this.#waypointsListModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredWaypoints.sort(sortWaypontByTime);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortWaypointByPrice);
    }
    return filteredWaypoints.sort(sortWaypointByDay) ;
  }

  init(){
    this.#destinations = [...this.#waypointsListModel.destinations];
    this.#renderEventsList();
  }

  createWaypoint(){
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newWaypointPresenter.init();
  }

  #handleStatusChange = ()=>{
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter)=> presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#waypointsListModel.addWaypoint(updateType, update);
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsListModel.updateWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsListModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data, this.#destinations);
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsList({ resetSortType:true});
        this.#renderEventsList();
        break;
    }
  };

  #renderWaypoint(waypoint, destinations){
    const waypointPresenter = new WaypointPresenter({
      eventsContainer:this.#eventsListComponent.element,
      onStatusChange:this.#handleStatusChange,
      onDataChange: this.#handleViewAction
    });
    waypointPresenter.init(waypoint, destinations);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  #renderWaypoints(waypoints){
    waypoints.forEach((waypoint)=>this.#renderWaypoint(waypoint, this.#destinations));
  }

  #renderEmptyList(){
    this.#emptyListComponent = new EmptyListView ({filterType: this.#currentFilterType});
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #handleSortTypeChange = (sortType)=>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType ;
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderSort(){
    this.#sortComponent = new SortView({currentSortType:this.#currentSortType,onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderTripInfo(){
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEventsList(){
    const waypoints = this.waypoints;
    const waypointsAmount = waypoints.length;
    this.#renderSort();

    if(waypointsAmount > 0){
      this.#renderTripInfo();
    } else{
      this.#renderEmptyList();
    }
    render(this.#eventsListComponent, this.#eventsContainer);
    this.#renderWaypoints(waypoints);
  }

  #clearEventsList({ resetSortType = false} = {}){
    this.#waypointPresenter.forEach((presenter)=> presenter.destroy());
    this.#waypointPresenter.clear();
    this.#newWaypointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }
}

