
import { render, remove } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { FilterType, SortType, UpdateType, UserAction, TimeLimit} from '../consts';
import { sortWaypointByPrice, sortWaypontByTime, sortWaypointByDay } from '../utils/waypoint';
import {filter} from '../utils/filter.js';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EmptyListView from '../view/empty-list-view';
import LoadingView from '../view/loading-view';
import LoadingErrorView from '../view/loading-error-view';
import WaypointPresenter from './waypoint-presenter';
import NewWaypointPresenter from './new-waypoint-presenter';

export default class ListPresenter{
  #eventsContainer = null;

  #waypointsListModel = null;
  #filtersModel = null;

  #filterType = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();
  #handleAddWaypointButtonStatus = null;

  #waypointPresenter = new Map();
  #newWaypointPresenter = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({eventsContainer,filtersModel, waypointsListModel, onNewWaypointDestroy, handleAddWaypointButtonStatus }){
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
    this.#filtersModel = filtersModel;

    this.#waypointsListModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#handleAddWaypointButtonStatus = handleAddWaypointButtonStatus;

    this.#newWaypointPresenter = new NewWaypointPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange:this.#handleViewAction,
      onDestroy:()=>{
        onNewWaypointDestroy();
        this.#renderEmptyList();},
      destinations:this.destinations,
      offers:this.offers,
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

  get destinations (){
    return this.#waypointsListModel.destinations;
  }

  get offers (){
    return this.#waypointsListModel.offers;
  }

  init(){
    this.#renderEventsList();
  }

  createWaypoint(){
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.waypoints.length === 0) {
      remove(this.#emptyListComponent);
      render(this.#eventsListComponent, this.#eventsContainer);
    }

    this.#newWaypointPresenter.init(this.destinations, this.offers);
  }

  #handleStatusChange = ()=>{
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter)=> presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsListModel.addWaypoint(updateType, update);
        } catch(err) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenter.get(update.id).setSaving();
        try {
          await this.#waypointsListModel.updateWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresenter.get(update.id).setDeleting();
        try {
          await this.#waypointsListModel.deleteWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsList({ resetSortType:true});
        this.#renderEventsList();
        break;
      case UpdateType.INIT:{
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventsList();
        break;
      }
      case UpdateType.INIT_ERROR:{
        this.#isLoading = false;
        this.#isLoadingError = true;
        remove(this.#loadingComponent);
        this.#renderEventsList();
        break;
      }
    }
  };

  #renderWaypoint(waypoint, destinations, offers){
    const waypointPresenter = new WaypointPresenter({
      eventsContainer:this.#eventsListComponent.element,
      onStatusChange:this.#handleStatusChange,
      onDataChange: this.#handleViewAction
    });
    waypointPresenter.init(waypoint, destinations, offers);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  #renderWaypoints(waypoints){
    waypoints.forEach((waypoint)=>this.#renderWaypoint(waypoint, this.destinations, this.offers));
  }

  #renderEmptyList(){
    this.#emptyListComponent = new EmptyListView ({filterType: this.#filterType});
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #renderLoading(){
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderLoadingError(){
    render(this.#loadingErrorComponent, this.#eventsContainer);
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

  #renderEventsList(){
    if(this.#isLoading){
      this.#renderLoading();
      this.#handleAddWaypointButtonStatus(true);
      return;
    }

    if(this.#isLoadingError){
      this.#renderLoadingError();
      return;
    }
    this.#handleAddWaypointButtonStatus(false);
    const waypoints = this.waypoints;
    const waypointsAmount = waypoints.length;
    if(waypointsAmount === 0 && !this.#isLoading){
      this.#renderEmptyList();
    }else{
      this.#renderSort();
    }

    render(this.#eventsListComponent, this.#eventsContainer);
    this.#renderWaypoints(waypoints);
  }

  #clearEventsList({resetSortType = false} = {}){
    this.#waypointPresenter.forEach((presenter)=> presenter.destroy());
    this.#waypointPresenter.clear();
    this.#newWaypointPresenter.destroy();
    remove(this.#sortComponent);
    if(this.#emptyListComponent){
      remove(this.#emptyListComponent);
    }
    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }
}

