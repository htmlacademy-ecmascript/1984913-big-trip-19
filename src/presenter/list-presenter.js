import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition, remove } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import ListEmptyView from '../view/list-empty-view';
import WaypointPresenter from './waypoint-presenter';
import { SortType, UpdateType, UserAction, WAYPOINTS_AMOUNT} from '../consts';
import { sortWaypointByPrice, sortWaypontByTime, sortWaypointByDay } from '../utils/waypoint';
import NewWaypointPresenter from './new-waypoint-presenter';
export default class ListPresenter{
  #headerContainer = null;
  #eventsContainer = null;
  #waypointsListModel = null;

  #filterType = null;

  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #emptyListComponent = new ListEmptyView(this.#filterType);
  #tripInfoComponent = new TripInfoView();

  #waypointPresenter = new Map();
  #newWaypointPresenter = null;

  #renderedWaypointsAmount = WAYPOINTS_AMOUNT;
  #destinations = [];
  #currentSortType = SortType.DAY;

  constructor({headerContainer, eventsContainer, waypointsListModel, onNewWaypointDestroy }){
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
    this.#filterType = '';
    this.#waypointsListModel.addObserver(this.#handleModelEvent);

    this.#newWaypointPresenter = new NewWaypointPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange:this.#handleViewAction,
      onDestroy:onNewWaypointDestroy,
      destinations:[...this.#waypointsListModel.destinations]
    });
  }

  get waypoints(){
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#waypointsListModel.waypoints].sort(sortWaypontByTime);
      case SortType.PRICE:
        return [...this.#waypointsListModel.waypoints].sort(sortWaypointByPrice);
    }
    return [...this.#waypointsListModel.waypoints].sort(sortWaypointByDay) ;
  }

  init(){
    this.#destinations = [...this.#waypointsListModel.destinations];
    this.#renderEventsList();
  }

  createWaypoint(){
    this.#currentSortType = SortType.DAY;
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
        this.#waypointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsList({resetRenderedWaypointsAmount: true, resetSortType:true});
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
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #handleSortTypeChange = (sortType)=>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType ;
    this.#clearEventsList({resetRenderedWaypointsAmount: true});
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
    this.#renderWaypoints(waypoints.slice(0, Math.min(waypointsAmount, this.#renderedWaypointsAmount)));
  }

  #clearEventsList({resetRenderedWaypointsAmount = false, resetSortType = false} = {}){
    const waypointsAmount = this.waypoints.length;
    this.#waypointPresenter.forEach((presenter)=> presenter.destroy());
    this.#waypointPresenter.clear();
    this.#newWaypointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    if(resetRenderedWaypointsAmount){
      this.#renderedWaypointsAmount = WAYPOINTS_AMOUNT;
    }else{
      this.#renderedWaypointsAmount = Math.min(waypointsAmount,this.#renderedWaypointsAmount );
    }
    if(resetSortType){
      this.currentSortType = SortType.DAY;
    }
  }
}

